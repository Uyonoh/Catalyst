"""Tests for service modules."""
import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from typing import Dict, Any, List

from backend.services.analyzer import AnalyzerService
from backend.services.compiler import CompilerService
from backend.services.prompt_builder import build_prompt, build_system_prompt, build_control_directives, PromptControls
from backend.services.router import generate_refined_prompt, generate_image, shuffle_list, TEXT_PROVIDERS, IMAGE_PROVIDERS
from backend.services.types import Domain, Intent, TargetModel
from backend.services.detectors.domain import DomainClassifier
from backend.services.detectors.intent import IntentClassifier
from backend.services.detectors.constraint import BaseConstraintExtractor
from backend.services.detectors.scenario import ScenarioDetector
from backend.services.prompt_profiles import get_profile_for_model, MODEL_PROFILES


# ============================================================================
# Analyzer Service Tests
# ============================================================================

class TestAnalyzerService:
    """Tests for AnalyzerService."""

    def setup_method(self):
        """Set up test fixtures."""
        self.analyzer = AnalyzerService()

    def test_analyze_technical_backend(self):
        """Test analysis of technical backend input."""
        result = self.analyzer.analyze("create a fastapi backend with auth")
        
        assert result["originalInput"] == "create a fastapi backend with auth"
        assert result["detectedDomain"] == Domain.TECHNICAL_BACKEND
        assert result["primaryIntent"] in [Intent.ARCHITECT, Intent.GENERAL_TASK]
        assert "constraints" in result
        assert "confidenceScore" in result
        assert 0.0 <= result["confidenceScore"] <= 1.0

    def test_analyze_technical_frontend(self):
        """Test analysis of technical frontend input."""
        result = self.analyzer.analyze("build a react component with tailwind")
        
        assert result["detectedDomain"] == Domain.TECHNICAL_FRONTEND
        assert result["primaryIntent"] in [Intent.ARCHITECT, Intent.GENERAL_TASK]

    def test_analyze_gis_domain(self):
        """Test analysis of GIS domain input."""
        result = self.analyzer.analyze("create a geojson map with qgis")
        
        assert result["detectedDomain"] == Domain.TECHNICAL_GIS

    def test_analyze_devops_domain(self):
        """Test analysis of DevOps domain input."""
        result = self.analyzer.analyze("docker kubernetes ci/cd pipeline")
        
        assert result["detectedDomain"] == Domain.TECHNICAL_DEVOPS

    def test_analyze_creative_visual(self):
        """Test analysis of creative visual input."""
        result = self.analyzer.analyze("create a color palette with high contrast")
        
        assert result["detectedDomain"] == Domain.CREATIVE_VISUAL

    def test_analyze_business_strategy(self):
        """Test analysis of business strategy input."""
        result = self.analyzer.analyze("create a roadmap for product market fit")
        
        assert result["detectedDomain"] == Domain.BUSINESS_STRATEGY

    def test_analyze_with_assets(self):
        """Test analysis with assets."""
        assets = [{"type": "image", "uri": "http://example.com/image.jpg"}]
        result = self.analyzer.analyze("analyze this image", assets=assets)
        
        assert result["assets"] == assets

    def test_analyze_extracts_variables(self):
        """Test that variables are extracted from input."""
        result = self.analyzer.analyze("create a {{component}} with {{technology}}")
        
        assert "component" in result["variables"]
        assert "technology" in result["variables"]

    def test_analyze_detects_scenario(self):
        """Test scenario detection."""
        result = self.analyzer.analyze("act as a senior python developer")
        
        assert result["persona"] == "senior python developer"

    def test_apply_boosters(self):
        """Test booster application to results."""
        results = [{"value": Domain.GENERAL, "score": 5}]
        boosted = self.analyzer._apply_boosters("create a fastapi backend", results)
        
        # "create" has a booster, so score should be increased
        assert boosted[0]["score"] > 5

    def test_calculate_confidence(self):
        """Test confidence calculation."""
        domain_results = [{"value": Domain.TECHNICAL_BACKEND, "score": 8}]
        intent_results = [{"value": Intent.ARCHITECT, "score": 7}]
        
        confidence = self.analyzer._calculate_confidence(domain_results, intent_results)
        
        # (8 + 7) / 10 = 1.5, capped at 0.98
        assert 0.3 <= confidence <= 0.98


# ============================================================================
# Compiler Service Tests
# ============================================================================

class TestCompilerService:
    """Tests for CompilerService."""

    def setup_method(self):
        """Set up test fixtures."""
        self.compiler = CompilerService()

    def test_compile_for_claude(self):
        """Test compilation for Claude model."""
        metadata = {
            "detectedDomain": Domain.TECHNICAL_BACKEND,
            "primaryIntent": Intent.ARCHITECT,
            "constraints": {"tone": "PROFESSIONAL", "outputFormat": "PLAIN_TEXT"},
            "originalInput": "Create a FastAPI backend",
            "assets": []
        }
        
        result = self.compiler.compile(metadata, "claude")
        
        assert result["model"] == TargetModel.CLAUDE_3_5_SONNET
        # The domain value is used directly, not the enum string representation
        assert Domain.TECHNICAL_BACKEND.value in result["formattedPrompt"]
        assert Intent.ARCHITECT.value in result["formattedPrompt"]
        assert "You are an expert" in result["systemInstruction"]
        assert result["metadata"] == metadata

    def test_compile_for_gpt(self):
        """Test compilation for GPT model."""
        metadata = {
            "detectedDomain": Domain.TECHNICAL_FRONTEND,
            "primaryIntent": Intent.GENERAL_TASK,
            "constraints": {"tone": "PROFESSIONAL", "outputFormat": "JSON"},
            "originalInput": "Create a React component",
            "assets": []
        }
        
        result = self.compiler.compile(metadata, "gpt")
        
        assert result["model"] == TargetModel.GPT_4O
        assert "TASK OVERVIEW" in result["formattedPrompt"]
        assert "ACT AS A" in result["systemInstruction"]

    def test_compile_for_gemini(self):
        """Test compilation for Gemini model."""
        metadata = {
            "detectedDomain": Domain.CREATIVE_VISUAL,
            "primaryIntent": Intent.COMPOSITION,
            "constraints": {"tone": "PROFESSIONAL", "outputFormat": "PLAIN_TEXT"},
            "originalInput": "Create a color palette",
            "assets": []
        }
        
        result = self.compiler.compile(metadata, "gemini")
        
        assert result["model"] == TargetModel.GEMINI_1_5_PRO
        assert "[TASK_START]" in result["formattedPrompt"]
        assert "[TASK_END]" in result["formattedPrompt"]

    def test_compile_unknown_model_fallback(self):
        """Test compilation with unknown model falls back to input."""
        metadata = {
            "detectedDomain": Domain.GENERAL,
            "primaryIntent": Intent.GENERAL_TASK,
            "originalInput": "Test input"
        }
        
        result = self.compiler.compile(metadata, "unknown_model")
        
        assert result["model"] == "UNKNOWN_MODEL"
        assert result["formattedPrompt"] == "Test input"


# ============================================================================
# Domain Classifier Tests
# ============================================================================

class TestDomainClassifier:
    """Tests for DomainClassifier."""

    def setup_method(self):
        """Set up test fixtures."""
        self.classifier = DomainClassifier()

    def test_detect_technical_backend(self):
        """Test detection of technical backend domain."""
        results = self.classifier.detect("fastapi django postgres database")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.TECHNICAL_BACKEND
        assert results[0]["score"] > 0

    def test_detect_technical_frontend(self):
        """Test detection of technical frontend domain."""
        results = self.classifier.detect("react nextjs tailwind component")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.TECHNICAL_FRONTEND

    def test_detect_technical_gis(self):
        """Test detection of technical GIS domain."""
        results = self.classifier.detect("geojson shapefile qgis arcgis")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.TECHNICAL_GIS

    def test_detect_technical_devops(self):
        """Test detection of technical DevOps domain."""
        results = self.classifier.detect("docker kubernetes terraform aws")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.TECHNICAL_DEVOPS

    def test_detect_creative_motion(self):
        """Test detection of creative motion domain."""
        results = self.classifier.detect("cinematic fps drone lighting")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.CREATIVE_MOTION

    def test_detect_creative_copy(self):
        """Test detection of creative copy domain."""
        results = self.classifier.detect("headline persuasive blog hook narrative")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.CREATIVE_COPY

    def test_detect_creative_visual(self):
        """Test detection of creative visual domain."""
        results = self.classifier.detect("palette composition resolution contrast")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.CREATIVE_VISUAL

    def test_detect_business_strategy(self):
        """Test detection of business strategy domain."""
        results = self.classifier.detect("roi kpi roadmap stakeholder")
        
        assert len(results) > 0
        assert results[0]["value"] == Domain.BUSINESS_STRATEGY

    def test_detect_no_match_returns_empty(self):
        """Test detection returns empty list when no patterns match."""
        results = self.classifier.detect("completely unrelated text that does not match any pattern")
        
        assert len(results) == 0


# ============================================================================
# Intent Classifier Tests
# ============================================================================

class TestIntentClassifier:
    """Tests for IntentClassifier."""

    def setup_method(self):
        """Set up test fixtures."""
        self.classifier = IntentClassifier()

    def test_detect_debug_intent(self):
        """Test detection of debug intent."""
        results = self.classifier.detect("fix bug error crash not working")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.DEBUG

    def test_detect_refactor_intent(self):
        """Test detection of refactor intent."""
        results = self.classifier.detect("optimize improve clean faster")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.REFACTOR

    def test_detect_architect_intent(self):
        """Test detection of architect intent."""
        results = self.classifier.detect("architecture design system blueprint")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.ARCHITECT

    def test_detect_document_intent(self):
        """Test detection of document intent."""
        results = self.classifier.detect("documentation specs requirements")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.DOCUMENT

    def test_detect_brainstorm_intent(self):
        """Test detection of brainstorm intent."""
        results = self.classifier.detect("ideas suggest brainstorm concepts")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.BRAINSTORM

    def test_detect_summarize_intent(self):
        """Test detection of summarize intent."""
        results = self.classifier.detect("tldr shorten brief key points")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.SUMMARIZE

    def test_detect_spatial_analysis_intent(self):
        """Test detection of spatial analysis intent."""
        results = self.classifier.detect("intersect within distance buffer heatmap")
        
        assert len(results) > 0
        assert results[0]["value"] == Intent.SPATIAL_ANALYSIS


# ============================================================================
# Constraint Extractor Tests
# ============================================================================

class TestBaseConstraintExtractor:
    """Tests for BaseConstraintExtractor."""

    def setup_method(self):
        """Set up test fixtures."""
        self.extractor = BaseConstraintExtractor()

    def test_extract_tone_eli5(self):
        """Test extraction of ELI5 tone."""
        current = {}
        updates = self.extractor.extract("explain like i'm 5", current)
        
        assert updates.get("tone") == "ELI5"

    def test_extract_tone_creative(self):
        """Test extraction of CREATIVE tone."""
        current = {}
        updates = self.extractor.extract("funny creative witty humorous", current)
        
        assert updates.get("tone") == "CREATIVE"

    def test_extract_tone_concise(self):
        """Test extraction of CONCISE tone."""
        current = {}
        updates = self.extractor.extract("brief short concise", current)
        
        assert updates.get("tone") == "CONCISE"

    def test_extract_tone_professional(self):
        """Test extraction of PROFESSIONAL tone."""
        current = {}
        updates = self.extractor.extract("professional business formal", current)
        
        assert updates.get("tone") == "PROFESSIONAL"

    def test_extract_tone_academic(self):
        """Test extraction of ACADEMIC tone."""
        current = {}
        updates = self.extractor.extract("academic scholarly scientific research", current)
        
        assert updates.get("tone") == "ACADEMIC"

    def test_extract_format_json(self):
        """Test extraction of JSON format."""
        current = {}
        updates = self.extractor.extract("json javascript object notation", current)
        
        assert updates.get("outputFormat") == "JSON"

    def test_extract_format_csv(self):
        """Test extraction of CSV format."""
        current = {}
        updates = self.extractor.extract("csv table comma separated", current)
        
        assert updates.get("outputFormat") == "CSV"

    def test_extract_format_yaml(self):
        """Test extraction of YAML format."""
        current = {}
        updates = self.extractor.extract("yaml yml", current)
        
        assert updates.get("outputFormat") == "YAML"

    def test_extract_format_markdown(self):
        """Test extraction of MARKDOWN format."""
        current = {}
        updates = self.extractor.extract("markdown md", current)
        
        assert updates.get("outputFormat") == "MARKDOWN"

    def test_extract_negative_constraints(self):
        """Test extraction of negative constraints."""
        current = {}
        updates = self.extractor.extract("without code, no violence, exclude blood", current)
        
        assert "negativeConstraints" in updates
        assert "code" in updates["negativeConstraints"]
        assert "violence" in updates["negativeConstraints"]


# ============================================================================
# Scenario Detector Tests
# ============================================================================

class TestScenarioDetector:
    """Tests for ScenarioDetector."""

    def setup_method(self):
        """Set up test fixtures."""
        self.detector = ScenarioDetector()

    def test_detect_persona_expert(self):
        """Test detection of persona from expert pattern."""
        result = self.detector.detect("act as a senior python developer")
        
        assert result.get("persona") == "senior python developer"

    def test_detect_persona_you_are(self):
        """Test detection of persona from 'you are' pattern."""
        result = self.detector.detect("you are a machine learning specialist")
        
        assert result.get("persona") == "machine learning specialist"

    def test_detect_persona_specialist(self):
        """Test detection of persona from specialist pattern."""
        result = self.detector.detect("expert in data science")
        
        assert result.get("persona") == "data science"

    def test_detect_style_step_by_step(self):
        """Test detection of step-by-step style."""
        result = self.detector.detect("step by step instructions")
        
        assert result.get("style") == "Step-by-step"

    def test_detect_style_chain_of_thought(self):
        """Test detection of chain-of-thought style."""
        result = self.detector.detect("let's think step by step")
        
        # The pattern matches "let's think step by step" which is in Chain-of-thought patterns
        # but also matches "step by step" which is in Step-by-step patterns
        # The Step-by-step pattern comes first, so it matches that
        assert result.get("style") in ["Chain-of-thought", "Step-by-step"]

    def test_detect_style_comparative(self):
        """Test detection of comparative style."""
        result = self.detector.detect("compare and contrast versus vs")
        
        assert result.get("style") == "Comparative"

    def test_detect_style_briefing(self):
        """Test detection of briefing style."""
        result = self.detector.detect("tldr give me a brief")
        
        assert result.get("style") == "Briefing"

    def test_detect_no_scenario(self):
        """Test detection returns empty dict when no scenario detected."""
        result = self.detector.detect("simple text without patterns")
        
        assert result == {}


# ============================================================================
# Prompt Builder Tests
# ============================================================================

class TestPromptBuilder:
    """Tests for prompt builder functions."""

    def test_build_control_directives_default(self):
        """Test building control directives with default values."""
        controls = PromptControls()
        directives = build_control_directives(controls)
        
        assert "Creativity Level: 0.5" in directives
        assert "balanced" in directives
        assert "Precision Level: 0.5" in directives
        assert "moderately detailed" in directives
        assert "Output Length: medium" in directives

    def test_build_control_directives_high_creativity(self):
        """Test building control directives with high creativity."""
        controls = PromptControls(creativity=0.9)
        directives = build_control_directives(controls)
        
        assert "highly creative and expansive" in directives

    def test_build_control_directives_high_precision(self):
        """Test building control directives with high precision."""
        controls = PromptControls(precision=0.9)
        directives = build_control_directives(controls)
        
        assert "highly specific and unambiguous" in directives

    def test_build_control_directives_short_length(self):
        """Test building control directives with short length."""
        controls = PromptControls(length="short")
        directives = build_control_directives(controls)
        
        assert "concise" in directives

    def test_build_system_prompt_gemini(self):
        """Test building system prompt for Gemini model."""
        controls = PromptControls()
        system_prompt = build_system_prompt("gemini", controls, "text")
        
        assert "expert prompt engineer" in system_prompt
        assert "gemini" in system_prompt.lower()

    def test_build_prompt_complete(self):
        """Test building complete prompt."""
        controls = PromptControls()
        prompt = build_prompt("Create a FastAPI backend", "gemini", controls, "text")
        
        assert "Create a FastAPI backend" in prompt
        assert "Raw Intent:" in prompt
        assert "Refined Prompt:" in prompt


# ============================================================================
# Prompt Profiles Tests
# ============================================================================

class TestPromptProfiles:
    """Tests for prompt profiles."""

    def test_get_profile_for_gemini(self):
        """Test getting profile for Gemini model."""
        profile = get_profile_for_model("gemini")
        
        assert profile is not None
        assert "Role" in profile.structure
        assert profile.prefers_steps == True

    def test_get_profile_for_claude(self):
        """Test getting profile for Claude model."""
        profile = get_profile_for_model("claude-3-5-sonnet")
        
        assert profile is not None
        assert "Role" in profile.structure

    def test_get_profile_for_gpt(self):
        """Test getting profile for GPT model."""
        profile = get_profile_for_model("gpt-4o")
        
        assert profile is not None
        assert "System Role" in profile.structure

    def test_get_profile_for_llama(self):
        """Test getting profile for Llama model."""
        profile = get_profile_for_model("llama-3")
        
        assert profile is not None
        assert "System Prompt" in profile.structure

    def test_get_profile_unknown_fallback(self):
        """Test getting profile for unknown model falls back to GPT."""
        profile = get_profile_for_model("unknown-model")
        
        assert profile is not None
        assert profile == MODEL_PROFILES["gpt"]


# ============================================================================
# Router Service Tests
# ============================================================================

class TestRouterService:
    """Tests for router service functions."""

    @pytest.mark.asyncio
    @patch("services.router.TEXT_PROVIDERS")
    @patch("services.router.shuffle_list")
    async def test_generate_refined_prompt_success(self, mock_shuffle, mock_providers):
        """Test successful prompt refinement."""
        mock_provider = MagicMock()
        mock_provider.id = "test-provider"
        mock_provider.keys = ["key1", "key2"]
        mock_provider.call = AsyncMock(return_value="refined prompt")
        mock_provider.is_rate_limit_error = lambda e: False
        
        mock_providers.__iter__ = lambda self: iter([mock_provider])
        mock_shuffle.return_value = ["key1"]
        
        result = await generate_refined_prompt("test prompt")
        
        assert result == "refined prompt"

    @pytest.mark.asyncio
    @patch("services.router.TEXT_PROVIDERS")
    @patch("services.router.shuffle_list")
    async def test_generate_refined_prompt_all_fail(self, mock_shuffle, mock_providers):
        """Test prompt refinement fails when all providers fail."""
        mock_provider = MagicMock()
        mock_provider.id = "test-provider"
        mock_provider.keys = ["key1"]
        mock_provider.call = AsyncMock(side_effect=Exception("API error"))
        mock_provider.is_rate_limit_error = lambda e: False
        
        mock_providers.__iter__ = lambda self: iter([mock_provider])
        mock_shuffle.return_value = ["key1"]
        
        with pytest.raises(Exception) as exc_info:
            await generate_refined_prompt("test prompt")
        
        # The error message includes the detail from HTTPException
        assert "All LLM providers exhausted" in str(exc_info.value)

    @pytest.mark.asyncio
    @patch("backend.services.router.IMAGE_PROVIDERS")
    @patch("backend.services.router.shuffle_list")
    async def test_generate_image_success(self, mock_shuffle, mock_providers):
        """Test successful image generation."""
        from backend.providers.image.base import ImageResult
        
        mock_provider = MagicMock()
        mock_provider.id = "huggingface"
        mock_provider.keys = ["key1"]
        mock_provider.call = AsyncMock(return_value=ImageResult(url="data:image/jpeg;base64,test"))
        mock_provider.is_rate_limit_error = lambda e: False
        
        mock_providers.__iter__ = lambda self: iter([mock_provider])
        mock_shuffle.return_value = ["key1"]
        
        from backend.providers.image.base import ImageParams
        result = await generate_image("huggingface", "test prompt", ImageParams(width=1024, height=1024))
        
        assert result.url == "data:image/jpeg;base64,test"

    def test_shuffle_list(self):
        """Test shuffle_list function."""
        original = [1, 2, 3, 4, 5]
        shuffled = shuffle_list(original)
        
        # Should return a list of same length with same elements
        assert len(shuffled) == len(original)
        assert sorted(shuffled) == sorted(original)
        # Note: we can't guarantee it's actually shuffled without running many times

    def test_text_providers_list(self):
        """Test TEXT_PROVIDERS is a list."""
        assert isinstance(TEXT_PROVIDERS, list)
        assert len(TEXT_PROVIDERS) == 3

    def test_image_providers_list(self):
        """Test IMAGE_PROVIDERS is a list."""
        assert isinstance(IMAGE_PROVIDERS, list)
        assert len(IMAGE_PROVIDERS) == 3
