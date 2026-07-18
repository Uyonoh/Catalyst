import pytest
from fastapi.testclient import TestClient
import os
import json
from unittest.mock import patch, MagicMock

# Set mock env vars
os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["SUPABASE_JWT_SECRET"] = "mock_secret"
os.environ["GEMINI_API_KEY_1"] = "mock_gemini_key"
os.environ["GROQ_API_KEY_1"] = "mock_groq_key"
os.environ["OPENROUTER_API_KEY_1"] = "mock_openrouter_key"
os.environ["HF_TOKEN_1"] = "mock_hf_token"

from main import app
from services.analyzer import AnalyzerService
from services.compiler import CompilerService
from services.prompt_builder import build_prompt, PromptControls

client = TestClient(app)

# Helper to bypass JWT check in tests by mocking jose.jwt.decode
def mock_jwt_decode(token, key, **kwargs):
    return {"sub": "test-user-id"}

@patch("auth.jwt.decode", side_effect=mock_jwt_decode)
def test_health_check(mock_decode):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_analyzer_service():
    analyzer = AnalyzerService()
    res = analyzer.analyze("create a simple fastapi backend components")
    assert res["detectedDomain"] == "TECHNICAL_BACKEND"
    assert res["primaryIntent"] == "GENERAL_TASK"
    assert res["constraints"]["tone"] == "PROFESSIONAL"

def test_compiler_service():
    compiler = CompilerService()
    meta = {
        "originalInput": "test input",
        "detectedDomain": "TECHNICAL_BACKEND",
        "primaryIntent": "GENERAL_TASK",
        "constraints": {
            "tone": "PROFESSIONAL",
            "outputFormat": "PLAIN_TEXT"
        },
        "assets": []
    }

    # Compile for Claude
    res = compiler.compile(meta, "claude")
    assert "Domain: TECHNICAL_BACKEND" in res["formattedPrompt"]
    assert "You are an expert" in res["systemInstruction"]

@patch("auth.jwt.decode", side_effect=mock_jwt_decode)
@patch("auth.get_jwks", return_value={"keys": []}) # mock JWKS fetching
def test_analyze_endpoint(mock_jwks, mock_decode):
    response = client.post(
        "/analyze",
        headers={"Authorization": "Bearer dummy_token"},
        json={"text": "create a fastapi app component", "model": "claude"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "model" in data
    assert "formattedPrompt" in data
    assert "systemInstruction" in data
    assert data["metadata"]["detectedDomain"] == "TECHNICAL_BACKEND"

@patch("auth.jwt.decode", side_effect=mock_jwt_decode)
@patch("auth.get_jwks", return_value={"keys": []})
@patch("routers.text.generate_refined_prompt", return_value="Refined: do something")
def test_generate_text_endpoint(mock_generate, mock_jwks, mock_decode):
    response = client.post(
        "/generate-text",
        headers={"Authorization": "Bearer dummy_token"},
        json={
            "text": "test prompt",
            "model": "gemini",
            "controls": {
                "creativity": 0.5,
                "precision": 0.5,
                "length": "medium",
                "outputFormat": "text"
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["refinedPrompt"] == "Refined: do something"
    assert data["format"] == "text"

@patch("auth.jwt.decode", side_effect=mock_jwt_decode)
@patch("auth.get_jwks", return_value={"keys": []})
@patch("routers.image.generate_image")
def test_generate_image_endpoint(mock_gen_img, mock_jwks, mock_decode):
    mock_result = MagicMock()
    mock_result.url = "data:image/jpeg;base64,mockdata"
    mock_gen_img.return_value = mock_result

    response = client.post(
        "/generate-image",
        headers={"Authorization": "Bearer dummy_token"},
        json={
            "model": "huggingface",
            "prompt": "a sunset image",
            "negativePrompt": "blurry",
            "aspectRatio": "1:1"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == "data:image/jpeg;base64,mockdata"
    assert data["width"] == 1024
    assert data["height"] == 1024
