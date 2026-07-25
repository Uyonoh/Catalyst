"""Pytest configuration and fixtures for Catalyst backend tests."""
import os
import pytest
from unittest.mock import patch, MagicMock, AsyncMock
import sys

# Set up environment variables for testing FIRST
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

def mock_get_unverified_header(token):
    """Mock JWT get_unverified_header that returns HS256 algorithm."""
    return {"alg": "HS256"}

# Apply patches BEFORE any test modules import backend.main
# Only patch JWT decode and header - NOT get_jwks (needed for auth tests)
_jwt_decode_patcher = patch("jose.jwt.decode", side_effect=mock_jwt_decode)
_jwt_header_patcher = patch("jose.jwt.get_unverified_header", side_effect=mock_get_unverified_header)

_jwt_decode_patcher.start()
_jwt_header_patcher.start()

# Import backend.main
import backend.main as main_module
import backend.auth as auth_module
from fastapi.testclient import TestClient

# Create test client with raise_server_exceptions
client = TestClient(main_module.app)

auth_module._jwks_cache = None
auth_module._jwks_fetched_at = 0.0

# Fixtures
@pytest.fixture
def mock_auth():
    """Fixture to mock JWT authentication (already patched globally)."""
    yield

@pytest.fixture
def test_client():
    """Fixture to provide a TestClient for FastAPI endpoints."""
    return client

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

# Cleanup
def pytest_sessionfinish(session, exitstatus):
    _jwt_decode_patcher.stop()
    _jwt_header_patcher.stop()
