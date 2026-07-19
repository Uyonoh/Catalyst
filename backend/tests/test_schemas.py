"""Tests for Pydantic schemas (schemas.py)."""
import pytest
from pydantic import ValidationError
from datetime import datetime
from typing import Optional, Dict, Any, List

from schemas import (
    PromptControls,
    TextGenerateRequest,
    TextGenerateResponse,
    ImageGenerateRequest,
    ImageGenerateResponse,
    AnalyzeRequest,
    AnalyzeResponse
)


class TestPromptControls:
    """Tests for PromptControls schema."""

    def test_prompt_controls_default_values(self):
        """Test PromptControls with default values."""
        controls = PromptControls()
        assert controls.creativity == 0.5
        assert controls.precision == 0.5
        assert controls.length == "medium"
        assert controls.outputFormat == "text"
        assert controls.strategy == "zero_shot"
        assert controls.failureHandling == False
        assert controls.tone == "neutral"
        assert controls.negativePrompt is None

    def test_prompt_controls_custom_values(self):
        """Test PromptControls with custom values."""
        controls = PromptControls(
            creativity=0.8,
            precision=0.3,
            length="long",
            outputFormat="json",
            strategy="chain_of_thought",
            failureHandling=True,
            tone="creative",
            negativePrompt="avoid violence"
        )
        assert controls.creativity == 0.8
        assert controls.precision == 0.3
        assert controls.length == "long"
        assert controls.outputFormat == "json"
        assert controls.strategy == "chain_of_thought"
        assert controls.failureHandling == True
        assert controls.tone == "creative"
        assert controls.negativePrompt == "avoid violence"

    def test_prompt_controls_partial_update(self):
        """Test PromptControls with partial values."""
        controls = PromptControls(creativity=0.9, tone="professional")
        assert controls.creativity == 0.9
        assert controls.tone == "professional"
        # Others should be defaults
        assert controls.precision == 0.5
        assert controls.length == "medium"


class TestTextGenerateRequest:
    """Tests for TextGenerateRequest schema."""

    def test_text_generate_request_required_fields(self):
        """Test TextGenerateRequest with required fields only."""
        request = TextGenerateRequest(
            text="Generate a FastAPI backend",
            model="gemini"
        )
        assert request.text == "Generate a FastAPI backend"
        assert request.model == "gemini"
        assert request.controls is not None
        assert isinstance(request.controls, PromptControls)
        assert request.mode == "text"

    def test_text_generate_request_with_all_fields(self):
        """Test TextGenerateRequest with all fields."""
        controls = PromptControls(creativity=0.8)
        request = TextGenerateRequest(
            text="Generate a FastAPI backend",
            model="gemini",
            controls=controls,
            mode="code"
        )
        assert request.text == "Generate a FastAPI backend"
        assert request.model == "gemini"
        assert request.controls == controls
        assert request.mode == "code"

    def test_text_generate_request_missing_required_fields(self):
        """Test TextGenerateRequest validation with missing required fields."""
        with pytest.raises(ValidationError) as exc_info:
            TextGenerateRequest()
        
        errors = exc_info.value.errors()
        assert len(errors) == 2  # text and model are required
        field_names = [e['loc'][0] for e in errors]
        assert 'text' in field_names
        assert 'model' in field_names


class TestTextGenerateResponse:
    """Tests for TextGenerateResponse schema."""

    def test_text_generate_response_all_fields(self):
        """Test TextGenerateResponse with all fields."""
        response = TextGenerateResponse(
            refinedPrompt="Create a FastAPI app with auth",
            format="text"
        )
        assert response.refinedPrompt == "Create a FastAPI app with auth"
        assert response.format == "text"

    def test_text_generate_response_minimal(self):
        """Test TextGenerateResponse with minimal fields."""
        response = TextGenerateResponse(refinedPrompt="Test prompt", format="json")
        assert response.refinedPrompt == "Test prompt"
        assert response.format == "json"


class TestImageGenerateRequest:
    """Tests for ImageGenerateRequest schema."""

    def test_image_generate_request_required_fields(self):
        """Test ImageGenerateRequest with required fields only."""
        request = ImageGenerateRequest(
            model="huggingface",
            prompt="A sunset over mountains"
        )
        assert request.model == "huggingface"
        assert request.prompt == "A sunset over mountains"
        assert request.negativePrompt == ""
        assert request.aspectRatio == "1:1"

    def test_image_generate_request_with_all_fields(self):
        """Test ImageGenerateRequest with all fields."""
        request = ImageGenerateRequest(
            model="huggingface",
            prompt="A sunset over mountains",
            negativePrompt="blurry, low quality",
            aspectRatio="16:9"
        )
        assert request.model == "huggingface"
        assert request.prompt == "A sunset over mountains"
        assert request.negativePrompt == "blurry, low quality"
        assert request.aspectRatio == "16:9"

    def test_image_generate_request_missing_required_fields(self):
        """Test ImageGenerateRequest validation with missing required fields."""
        with pytest.raises(ValidationError) as exc_info:
            ImageGenerateRequest()
        
        errors = exc_info.value.errors()
        assert len(errors) == 2  # model and prompt are required
        field_names = [e['loc'][0] for e in errors]
        assert 'model' in field_names
        assert 'prompt' in field_names


class TestImageGenerateResponse:
    """Tests for ImageGenerateResponse schema."""

    def test_image_generate_response_all_fields(self):
        """Test ImageGenerateResponse with all fields."""
        response = ImageGenerateResponse(
            url="data:image/jpeg;base64,encoded_data",
            width=1024,
            height=1024,
            seed=123456,
            prompt="A sunset over mountains"
        )
        assert response.url == "data:image/jpeg;base64,encoded_data"
        assert response.width == 1024
        assert response.height == 1024
        assert response.seed == 123456
        assert response.prompt == "A sunset over mountains"

    def test_image_generate_response_minimal(self):
        """Test ImageGenerateResponse with minimal fields (all required)."""
        response = ImageGenerateResponse(
            url="http://example.com/image.jpg",
            width=512,
            height=512,
            seed=0,
            prompt=""
        )
        assert response.url == "http://example.com/image.jpg"
        assert response.width == 512
        assert response.height == 512


class TestAnalyzeRequest:
    """Tests for AnalyzeRequest schema."""

    def test_analyze_request_required_fields(self):
        """Test AnalyzeRequest with required fields only."""
        request = AnalyzeRequest(text="Create a FastAPI backend")
        assert request.text == "Create a FastAPI backend"
        assert request.model == "claude"  # default

    def test_analyze_request_with_model(self):
        """Test AnalyzeRequest with custom model."""
        request = AnalyzeRequest(
            text="Create a FastAPI backend",
            model="gemini"
        )
        assert request.text == "Create a FastAPI backend"
        assert request.model == "gemini"

    def test_analyze_request_missing_required_fields(self):
        """Test AnalyzeRequest validation with missing required fields."""
        with pytest.raises(ValidationError) as exc_info:
            AnalyzeRequest()
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]['loc'][0] == 'text'


class TestAnalyzeResponse:
    """Tests for AnalyzeResponse schema."""

    def test_analyze_response_all_fields(self):
        """Test AnalyzeResponse with all fields."""
        response = AnalyzeResponse(
            model="claude",
            formattedPrompt="Detailed prompt here",
            systemInstruction="You are an expert",
            metadata={"detectedDomain": "TECHNICAL_BACKEND", "confidence": 0.95}
        )
        assert response.model == "claude"
        assert response.formattedPrompt == "Detailed prompt here"
        assert response.systemInstruction == "You are an expert"
        assert response.metadata == {"detectedDomain": "TECHNICAL_BACKEND", "confidence": 0.95}

    def test_analyze_response_minimal(self):
        """Test AnalyzeResponse with minimal fields."""
        response = AnalyzeResponse(
            model="gemini",
            formattedPrompt="Test prompt",
            metadata={}
        )
        assert response.model == "gemini"
        assert response.formattedPrompt == "Test prompt"
        assert response.metadata == {}
        assert response.systemInstruction is None


class TestSchemaSerialization:
    """Tests for schema serialization and deserialization."""

    def test_text_generate_request_from_dict(self):
        """Test creating TextGenerateRequest from dict."""
        data = {
            "text": "Test prompt",
            "model": "gemini",
            "controls": {
                "creativity": 0.8,
                "precision": 0.6
            },
            "mode": "code"
        }
        request = TextGenerateRequest(**data)
        assert request.text == "Test prompt"
        assert request.model == "gemini"
        assert request.controls.creativity == 0.8
        assert request.mode == "code"

    def test_image_generate_response_to_dict(self):
        """Test converting ImageGenerateResponse to dict."""
        response = ImageGenerateResponse(
            url="http://example.com/image.jpg",
            width=1024,
            height=768,
            seed=999,
            prompt="Test prompt"
        )
        data = response.model_dump()
        assert data["url"] == "http://example.com/image.jpg"
        assert data["width"] == 1024
        assert data["height"] == 768
        assert data["seed"] == 999
        assert data["prompt"] == "Test prompt"

    def test_analyze_response_json_serialization(self):
        """Test JSON serialization of AnalyzeResponse."""
        response = AnalyzeResponse(
            model="claude",
            formattedPrompt={"prompt": "test", "details": "more"},
            systemInstruction="Instructions here",
            metadata={"detectedDomain": "TECHNICAL_BACKEND"}
        )
        # Should not raise
        json_str = response.model_dump_json()
        assert "claude" in json_str
        assert "TECHNICAL_BACKEND" in json_str
