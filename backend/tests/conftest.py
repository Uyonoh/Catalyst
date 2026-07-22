"""Pytest configuration and fixtures for Catalyst backend tests."""
import os
import pytest
from unittest.mock import patch, MagicMock, AsyncMock
import sys

# Set up environment variables for testing
os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["SUPABASE_JWT_SECRET"] = "mock_secret_key_12345"
os.environ["SUPABASE_JWT_AUDIENCE"] = "authenticated"
os.environ["SUPABASE_PUBLISHABLE_DEFAULT_KEY"] = "mock_publishable_key"
os.environ["GEMINI_API_KEY_1"] = "mock_gemini_key"
os.environ["GROQ_API_KEY_1"] = "mock_groq_key"
os.environ["OPENROUTER_API_KEY_1"] = "mock_openrouter_key"
os.environ["HF_TOKEN_1"] = "mock_hf_token"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000"

# Mock JWT decode to bypass auth in tests
def mock_jwt_decode(token, key, **kwargs):
    """Mock JWT decode that returns a test user payload."""
    return {"sub": "test-user-id", "exp": 9999999999}

@pytest.fixture
def mock_auth():
    """Fixture to mock JWT authentication."""
    with patch("backend.auth.jwt.decode", side_effect=mock_jwt_decode):
        with patch("backend.auth.get_jwks", new_callable=AsyncMock, return_value={"keys": []}):
            yield

@pytest.fixture
def test_client():
    """Fixture to provide a TestClient for FastAPI endpoints."""
    from fastapi.testclient import TestClient
    from backend.main import app
    return TestClient(app)

@pytest.fixture
def mock_jwks():
    """Fixture to mock JWKS fetching."""
    return {
        "keys": [
            {
                "kid": "test-kid",
                "kty": "RSA",
                "n": "test_n",
                "e": "AQAB"
            }
        ]
    }
