"""Tests for FastAPI routers."""
import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient
import os
import sys

# Set up test environment BEFORE importing main
os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["SUPABASE_JWT_SECRET"] = "mock_secret_key"
os.environ["SUPABASE_JWT_AUDIENCE"] = "authenticated"
os.environ["GEMINI_API_KEY_1"] = "mock_gemini_key"
os.environ["GROQ_API_KEY_1"] = "mock_groq_key"
os.environ["OPENROUTER_API_KEY_1"] = "mock_openrouter_key"
os.environ["HF_TOKEN_1"] = "mock_hf_token"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000"

from backend.main import app
from backend.schemas import TextGenerateRequest, ImageGenerateRequest, AnalyzeRequest

client = TestClient(app)


def mock_jwt_decode(token, key, **kwargs):
    """Mock JWT decode that returns a test user payload."""
    return {"sub": "test-user-id", "exp": 9999999999}


@pytest.fixture(autouse=True)
def mock_auth_fixture():
    """Fixture to mock authentication for all tests."""
    with patch("backend.auth.jwt.decode", side_effect=mock_jwt_decode):
        with patch("backend.auth.get_jwks", new_callable=AsyncMock, return_value={"keys": []}):
            yield


# ============================================================================
# Health Check Tests
# ============================================================================

class TestHealthCheck:
    """Tests for health check endpoint."""

    def test_health_check_returns_healthy(self):
        """Test that health check returns healthy status."""
        response = client.get("/health")
        
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


# ============================================================================
# Analyze Router Tests
# ============================================================================

class TestAnalyzeRouter:
    """Tests for /analyze endpoint."""

    def test_analyze_endpoint_success(self, mock_auth_fixture):
        """Test analyze endpoint with valid request."""
        request_data = {
            "text": "create a fastapi backend with authentication",
            "model": "claude"
        }
        
        response = client.post(
            "/analyze",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "model" in data
        assert "formattedPrompt" in data
        assert "systemInstruction" in data
        assert "metadata" in data
        assert data["metadata"]["detectedDomain"] == "TECHNICAL_BACKEND"
        assert data["model"] == "CLAUDE_3_5_SONNET"

    def test_analyze_endpoint_with_gemini(self, mock_auth_fixture):
        """Test analyze endpoint with gemini model."""
        request_data = {
            "text": "generate a python script",
            "model": "gemini"
        }
        
        response = client.post(
            "/analyze",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["model"] == "GEMINI_1_5_PRO"

    def test_analyze_endpoint_missing_text(self, mock_auth_fixture):
        """Test analyze endpoint with missing text field."""
        request_data = {"model": "claude"}
        
        response = client.post(
            "/analyze",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 422  # Validation error

    def test_analyze_endpoint_technical_gis(self, mock_auth_fixture):
        """Test analyze endpoint with GIS domain detection."""
        request_data = {
            "text": "create a geojson map with qgis",
            "model": "claude"
        }
        
        response = client.post(
            "/analyze",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["metadata"]["detectedDomain"] == "TECHNICAL_GIS"


# ============================================================================
# Text Router Tests
# ============================================================================

class TestTextRouter:
    """Tests for /generate-text endpoint."""

    @patch("backend.routers.text.generate_refined_prompt", new_callable=AsyncMock, return_value="Refined: create a fastapi backend")
    def test_generate_text_endpoint_success(self, mock_refined, mock_auth_fixture):
        """Test text generation endpoint with valid request."""
        request_data = {
            "text": "create a fastapi backend",
            "model": "gemini",
            "controls": {
                "creativity": 0.5,
                "precision": 0.5,
                "length": "medium",
                "outputFormat": "text"
            }
        }
        
        response = client.post(
            "/generate-text",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "refinedPrompt" in data
        assert "format" in data
        assert data["format"] == "text"

    @patch("backend.routers.text.generate_refined_prompt", new_callable=AsyncMock, return_value="```json{\"test\": 1}```")
    def test_generate_text_endpoint_cleans_code_blocks(self, mock_refined, mock_auth_fixture):
        """Test text generation cleans code blocks from response."""
        request_data = {
            "text": "create a json schema",
            "model": "gemini",
            "controls": {"outputFormat": "json"}
        }
        
        response = client.post(
            "/generate-text",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        # Code blocks should be cleaned
        assert "```" not in data["refinedPrompt"]

    def test_generate_text_endpoint_missing_fields(self, mock_auth_fixture):
        """Test text generation with missing required fields."""
        request_data = {}  # Missing text and model
        
        response = client.post(
            "/generate-text",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 422  # Validation error

    @patch("backend.routers.text.generate_refined_prompt", new_callable=AsyncMock, return_value="  \n  test prompt  \n  ")
    def test_generate_text_endpoint_strips_whitespace(self, mock_refined, mock_auth_fixture):
        """Test text generation strips whitespace."""
        request_data = {
            "text": "test",
            "model": "gemini"
        }
        
        response = client.post(
            "/generate-text",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["refinedPrompt"] == "test prompt"

    @patch("backend.routers.text.generate_refined_prompt", new_callable=AsyncMock, return_value="test with ```json and ```markdown")
    def test_generate_text_endpoint_cleans_mixed_backticks(self, mock_refined, mock_auth_fixture):
        """Test text generation cleans mixed backticks."""
        request_data = {
            "text": "test",
            "model": "gemini"
        }
        
        response = client.post(
            "/generate-text",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "```json" not in data["refinedPrompt"]
        assert "```markdown" not in data["refinedPrompt"]
        assert "```" not in data["refinedPrompt"]


# ============================================================================
# Image Router Tests
# ============================================================================

class TestImageRouter:
    """Tests for /generate-image endpoint."""

    @patch("backend.routers.image.generate_image")
    def test_generate_image_endpoint_success(self, mock_gen_img, mock_auth_fixture):
        """Test image generation endpoint with valid request."""
        from backend.providers.image.base import ImageResult
        from unittest.mock import AsyncMock
        mock_result = ImageResult(url="data:image/jpeg;base64,testdata")
        mock_gen_img.return_value = AsyncMock(return_value=mock_result)
        
        request_data = {
            "model": "huggingface",
            "prompt": "a sunset over mountains",
            "negativePrompt": "blurry, low quality",
            "aspectRatio": "16:9"
        }
        
        response = client.post(
            "/generate-image",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["url"] == "data:image/jpeg;base64,testdata"
        assert data["width"] == 1024
        assert data["height"] == 576  # 16:9 aspect ratio
        assert "seed" in data
        assert data["prompt"] == "a sunset over mountains"

    @patch("backend.routers.image.generate_image")
    def test_generate_image_endpoint_1_1_aspect(self, mock_gen_img, mock_auth_fixture):
        """Test image generation with 1:1 aspect ratio."""
        from backend.providers.image.base import ImageResult
        from unittest.mock import AsyncMock
        mock_result = ImageResult(url="data:image/jpeg;base64,testdata")
        mock_gen_img.return_value = AsyncMock(return_value=mock_result)
        
        request_data = {
            "model": "huggingface",
            "prompt": "a portrait",
            "aspectRatio": "1:1"
        }
        
        response = client.post(
            "/generate-image",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["width"] == 1024
        assert data["height"] == 1024

    @patch("backend.routers.image.generate_image")
    def test_generate_image_endpoint_unknown_aspect(self, mock_gen_img, mock_auth_fixture):
        """Test image generation with unknown aspect ratio defaults to 1:1."""
        from backend.providers.image.base import ImageResult
        from unittest.mock import AsyncMock
        mock_result = ImageResult(url="data:image/jpeg;base64,testdata")
        mock_gen_img.return_value = AsyncMock(return_value=mock_result)
        
        request_data = {
            "model": "huggingface",
            "prompt": "test",
            "aspectRatio": "99:99"  # Unknown ratio
        }
        
        response = client.post(
            "/generate-image",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["width"] == 1024
        assert data["height"] == 1024  # Default to 1:1

    def test_generate_image_endpoint_missing_fields(self, mock_auth_fixture):
        """Test image generation with missing required fields."""
        request_data = {}  # Missing model and prompt
        
        response = client.post(
            "/generate-image",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 422  # Validation error

    @patch("backend.routers.image.generate_image")
    def test_generate_image_endpoint_all_aspect_ratios(self, mock_gen_img, mock_auth_fixture):
        """Test all supported aspect ratios."""
        from backend.providers.image.base import ImageResult
        from unittest.mock import AsyncMock
        mock_result = ImageResult(url="data:image/jpeg;base64,testdata")
        mock_gen_img.return_value = AsyncMock(return_value=mock_result)
        
        aspect_ratios = ["1:1", "16:9", "9:16", "4:3", "3:4"]
        expected_dimensions = [
            (1024, 1024),
            (1024, 576),
            (576, 1024),
            (1024, 768),
            (768, 1024)
        ]
        
        for ratio, (expected_w, expected_h) in zip(aspect_ratios, expected_dimensions):
            request_data = {
                "model": "huggingface",
                "prompt": "test",
                "aspectRatio": ratio
            }
            
            response = client.post(
                "/generate-image",
                headers={"Authorization": "Bearer dummy_token"},
                json=request_data
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["width"] == expected_w
            assert data["height"] == expected_h


# ============================================================================
# Authentication Tests for Routers
# ============================================================================

class TestRouterAuthentication:
    """Tests for authentication on router endpoints."""

    def test_analyze_without_auth(self):
        """Test analyze endpoint without authentication."""
        response = client.post(
            "/analyze",
            json={"text": "test", "model": "claude"}
        )
        
        assert response.status_code == 401

    def test_text_without_auth(self):
        """Test text generation endpoint without authentication."""
        response = client.post(
            "/generate-text",
            json={"text": "test", "model": "gemini"}
        )
        
        assert response.status_code == 401

    def test_image_without_auth(self):
        """Test image generation endpoint without authentication."""
        response = client.post(
            "/generate-image",
            json={"model": "huggingface", "prompt": "test"}
        )
        
        assert response.status_code == 401

    @patch("backend.auth.jwt.decode", side_effect=mock_jwt_decode)
    @patch("backend.auth.get_jwks", new_callable=AsyncMock, return_value={"keys": []})
    def test_analyze_with_invalid_token(self, mock_jwks, mock_decode):
        """Test analyze endpoint with invalid token."""
        # Mock decode to raise error for invalid token
        from jose import JWTError
        
        def mock_decode_invalid(token, key, **kwargs):
            if token == "invalid_token":
                raise JWTError("Invalid token")
            return {"sub": "test-user-id"}
        
        with patch("backend.auth.jwt.decode", side_effect=mock_decode_invalid):
            response = client.post(
                "/analyze",
                headers={"Authorization": "Bearer invalid_token"},
                json={"text": "test", "model": "claude"}
            )
            
            assert response.status_code == 401


# ============================================================================
# Response Model Validation Tests
# ============================================================================

class TestResponseModels:
    """Tests for response model validation."""

    @patch("backend.routers.text.generate_refined_prompt", new_callable=AsyncMock, return_value="test")
    def test_text_response_model(self, mock_refined, mock_auth_fixture):
        """Test TextGenerateResponse model validation."""
        request_data = {
            "text": "test",
            "model": "gemini",
            "controls": {"outputFormat": "json"}
        }
        
        response = client.post(
            "/generate-text",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["refinedPrompt"], str)
        assert isinstance(data["format"], str)

    @patch("backend.routers.image.generate_image")
    def test_image_response_model(self, mock_gen_img, mock_auth_fixture):
        """Test ImageGenerateResponse model validation."""
        from backend.providers.image.base import ImageResult
        from unittest.mock import AsyncMock
        mock_result = ImageResult(url="http://example.com/image.jpg")
        mock_gen_img.return_value = AsyncMock(return_value=mock_result)
        
        request_data = {
            "model": "huggingface",
            "prompt": "test"
        }
        
        response = client.post(
            "/generate-image",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["url"], str)
        assert isinstance(data["width"], int)
        assert isinstance(data["height"], int)
        assert isinstance(data["seed"], int)
        assert isinstance(data["prompt"], str)

    def test_analyze_response_model(self, mock_auth_fixture):
        """Test AnalyzeResponse model validation."""
        request_data = {
            "text": "test",
            "model": "claude"
        }
        
        response = client.post(
            "/analyze",
            headers={"Authorization": "Bearer dummy_token"},
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["model"], str)
        assert isinstance(data["formattedPrompt"], str)
        assert isinstance(data["metadata"], dict)
