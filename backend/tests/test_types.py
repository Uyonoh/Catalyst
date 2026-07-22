"""Tests for types module (services/types.py)."""
import pytest
from enum import Enum

from backend.services.types import (
    InputModality,
    TargetModel,
    Domain,
    Intent
)


class TestInputModality:
    """Tests for InputModality enum."""

    def test_input_modality_values(self):
        """Test all InputModality enum values."""
        assert InputModality.TEXT == "TEXT"
        assert InputModality.IMAGE == "IMAGE"
        assert InputModality.VIDEO == "VIDEO"
        assert InputModality.AUDIO == "AUDIO"
        assert InputModality.CODE == "CODE"
        assert InputModality.GEOSPATIAL == "GEOSPATIAL"

    def test_input_modality_is_enum(self):
        """Test that InputModality is an Enum."""
        assert isinstance(InputModality, type)
        assert issubclass(InputModality, Enum)


class TestTargetModel:
    """Tests for TargetModel enum."""

    def test_target_model_values(self):
        """Test all TargetModel enum values."""
        assert TargetModel.GPT_4O == "GPT_4O"
        assert TargetModel.CLAUDE_3_5_SONNET == "CLAUDE_3_5_SONNET"
        assert TargetModel.GEMINI_1_5_PRO == "GEMINI_1_5_PRO"
        assert TargetModel.LLAMA_3 == "LLAMA_3"
        assert TargetModel.GROK_1 == "GROK_1"
        assert TargetModel.DALLE_3 == "DALLE_3"
        assert TargetModel.STABLE_DIFFUSION_XL == "STABLE_DIFFUSION_XL"
        assert TargetModel.MIDJOURNEY_V6 == "MIDJOURNEY_V6"
        assert TargetModel.VEO_VIDEO == "VEO_VIDEO"

    def test_target_model_is_enum(self):
        """Test that TargetModel is an Enum."""
        assert isinstance(TargetModel, type)
        assert issubclass(TargetModel, Enum)

    def test_target_model_string_conversion(self):
        """Test that TargetModel can be converted to string."""
        assert TargetModel.GPT_4O.value == "GPT_4O"
        assert TargetModel.CLAUDE_3_5_SONNET.value == "CLAUDE_3_5_SONNET"


class TestDomain:
    """Tests for Domain enum."""

    def test_domain_values(self):
        """Test all Domain enum values."""
        assert Domain.TECHNICAL_BACKEND == "TECHNICAL_BACKEND"
        assert Domain.TECHNICAL_FRONTEND == "TECHNICAL_FRONTEND"
        assert Domain.TECHNICAL_GIS == "TECHNICAL_GIS"
        assert Domain.TECHNICAL_DEVOPS == "TECHNICAL_DEVOPS"
        assert Domain.CREATIVE_MOTION == "CREATIVE_MOTION"
        assert Domain.CREATIVE_COPY == "CREATIVE_COPY"
        assert Domain.CREATIVE_VISUAL == "CREATIVE_VISUAL"
        assert Domain.BUSINESS_STRATEGY == "BUSINESS_STRATEGY"
        assert Domain.GENERAL == "GENERAL"

    def test_domain_is_enum(self):
        """Test that Domain is an Enum."""
        assert isinstance(Domain, type)
        assert issubclass(Domain, Enum)

    def test_domain_string_conversion(self):
        """Test that Domain can be converted to string."""
        assert Domain.TECHNICAL_BACKEND.value == "TECHNICAL_BACKEND"
        assert Domain.BUSINESS_STRATEGY.value == "BUSINESS_STRATEGY"

    def test_domain_equality(self):
        """Test Domain enum equality."""
        assert Domain.TECHNICAL_BACKEND == Domain.TECHNICAL_BACKEND
        assert Domain.TECHNICAL_BACKEND != Domain.TECHNICAL_FRONTEND


class TestIntent:
    """Tests for Intent enum."""

    def test_intent_values(self):
        """Test all Intent enum values."""
        assert Intent.DEBUG == "DEBUG"
        assert Intent.REFACTOR == "REFACTOR"
        assert Intent.ARCHITECT == "ARCHITECT"
        assert Intent.SPATIAL_ANALYSIS == "SPATIAL_ANALYSIS"
        assert Intent.DOCUMENT == "DOCUMENT"
        assert Intent.STORYBOARD == "STORYBOARD"
        assert Intent.COLOR_GRADE == "COLOR_GRADE"
        assert Intent.COMPOSITION == "COMPOSITION"
        assert Intent.SCRIPTWRITING == "SCRIPTWRITING"
        assert Intent.STYLE_TRANSFER == "STYLE_TRANSFER"
        assert Intent.SUMMARIZE == "SUMMARIZE"
        assert Intent.EXPAND == "EXPAND"
        assert Intent.BRAINSTORM == "BRAINSTORM"
        assert Intent.GENERAL_TASK == "GENERAL_TASK"

    def test_intent_is_enum(self):
        """Test that Intent is an Enum."""
        assert isinstance(Intent, type)
        assert issubclass(Intent, Enum)

    def test_intent_string_conversion(self):
        """Test that Intent can be converted to string."""
        assert Intent.DEBUG.value == "DEBUG"
        assert Intent.ARCHITECT.value == "ARCHITECT"

    def test_intent_equality(self):
        """Test Intent enum equality."""
        assert Intent.DEBUG == Intent.DEBUG
        assert Intent.DEBUG != Intent.REFACTOR


class TestEnumIteration:
    """Tests for iterating over enums."""

    def test_iterate_input_modalities(self):
        """Test iterating over InputModality enum."""
        modalities = list(InputModality)
        
        assert len(modalities) == 6
        assert InputModality.TEXT in modalities
        assert InputModality.IMAGE in modalities

    def test_iterate_target_models(self):
        """Test iterating over TargetModel enum."""
        models = list(TargetModel)
        
        assert len(models) == 9
        assert TargetModel.GPT_4O in models
        assert TargetModel.CLAUDE_3_5_SONNET in models

    def test_iterate_domains(self):
        """Test iterating over Domain enum."""
        domains = list(Domain)
        
        assert len(domains) == 9
        assert Domain.TECHNICAL_BACKEND in domains
        assert Domain.GENERAL in domains

    def test_iterate_intents(self):
        """Test iterating over Intent enum."""
        intents = list(Intent)
        
        assert len(intents) == 14
        assert Intent.DEBUG in intents
        assert Intent.GENERAL_TASK in intents


class TestEnumMembership:
    """Tests for enum membership and value checking."""

    def test_domain_has_technical_backend(self):
        """Test that TECHNICAL_BACKEND is in Domain."""
        assert hasattr(Domain, "TECHNICAL_BACKEND")

    def test_intent_has_debug(self):
        """Test that DEBUG is in Intent."""
        assert hasattr(Intent, "DEBUG")

    def test_target_model_has_claude(self):
        """Test that CLAUDE_3_5_SONNET is in TargetModel."""
        assert hasattr(TargetModel, "CLAUDE_3_5_SONNET")

    def test_domain_value_in_enum(self):
        """Test that domain values are in the enum."""
        assert "TECHNICAL_BACKEND" in [d.value for d in Domain]
        assert "BUSINESS_STRATEGY" in [d.value for d in Domain]

    def test_intent_value_in_enum(self):
        """Test that intent values are in the enum."""
        assert "DEBUG" in [i.value for i in Intent]
        assert "BRAINSTORM" in [i.value for i in Intent]

    def test_target_model_value_in_enum(self):
        """Test that target model values are in the enum."""
        assert "GPT_4O" in [m.value for m in TargetModel]
        assert "DALLE_3" in [m.value for m in TargetModel]


class TestEnumFromString:
    """Tests for creating enums from strings."""

    def test_domain_from_string(self):
        """Test creating Domain from string."""
        domain = Domain("TECHNICAL_BACKEND")
        assert domain == Domain.TECHNICAL_BACKEND

    def test_intent_from_string(self):
        """Test creating Intent from string."""
        intent = Intent("DEBUG")
        assert intent == Intent.DEBUG

    def test_target_model_from_string(self):
        """Test creating TargetModel from string."""
        model = TargetModel("GPT_4O")
        assert model == TargetModel.GPT_4O

    def test_invalid_domain_string(self):
        """Test that invalid domain string raises ValueError."""
        with pytest.raises(ValueError):
            Domain("INVALID_DOMAIN")

    def test_invalid_intent_string(self):
        """Test that invalid intent string raises ValueError."""
        with pytest.raises(ValueError):
            Intent("INVALID_INTENT")

    def test_invalid_target_model_string(self):
        """Test that invalid target model string raises ValueError."""
        with pytest.raises(ValueError):
            TargetModel("INVALID_MODEL")
