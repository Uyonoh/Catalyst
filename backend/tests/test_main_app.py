"""Tests for main application module (main.py)."""
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
import os

# Set up test environment
os.environ["SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["SUPABASE_JWT_SECRET"] = "mock_secret_key"
os.environ["SUPABASE_JWT_AUDIENCE"] = "authenticated"
os.environ["GEMINI_API_KEY_1"] = "mock_gemini_key"
os.environ["GROQ_API_KEY_1"] = "mock_groq_key"
os.environ["OPENROUTER_API_KEY_1"] = "mock_openrouter_key"
os.environ["HF_TOKEN_1"] = "mock_hf_token"
os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000,https://example.com"

from backend.main import app

client = TestClient(app)


class TestMainApp:
    """Tests for main FastAPI application."""

    def test_app_exists(self):
        """Test that FastAPI app is properly initialized."""
        assert app is not None
        assert hasattr(app, "title")
        assert app.title == "Catalyst Backend LLM Inference Service"
        assert app.version == "1.0.0"

    def test_app_has_routers(self):
        """Test that app has all required routers."""
        # Check that routes are registered
        routes = [route.path for route in app.routes]
        
        # Check for health endpoint
        assert "/health" in routes
        
        # Check for router prefixes
        has_text_router = any("/generate-text" in r for r in routes)
        has_image_router = any("/generate-image" in r for r in routes)
        has_analyze_router = any("/analyze" in r for r in routes)
        
        assert has_text_router
        assert has_image_router
        assert has_analyze_router

    def test_app_metadata(self):
        """Test app metadata."""
        assert app.title == "Catalyst Backend LLM Inference Service"
        assert app.version == "1.0.0"


class TestCORSConfiguration:
    """Tests for CORS configuration."""

    def test_cors_allowed_origins_from_env(self):
        """Test that CORS allowed origins are loaded from environment."""
        # Reimport to get fresh configuration
        import importlib
        import main
        importlib.reload(main)
        
        # Check that ALLOWED_ORIGINS is set correctly
        assert "http://localhost:3000" in main.ALLOWED_ORIGINS
        assert "https://example.com" in main.ALLOWED_ORIGINS

    def test_cors_middleware_configured(self):
        """Test that CORS middleware is configured."""
        # Check that CORSMiddleware is in the app's middleware stack
        middleware_classes = [type(m) for m in app.user_middleware]
        from fastapi.middleware.cors import CORSMiddleware
        
        assert CORSMiddleware in middleware_classes


class TestStartupEvent:
    """Tests for startup event."""

    @patch("backend.main.get_jwks", new_callable=AsyncMock)
    def test_startup_event_calls_get_jwks(self, mock_get_jwks):
        """Test that startup event calls get_jwks."""
        # Trigger startup event
        from backend.main import startup_event
        import asyncio
        
        asyncio.run(startup_event())
        
        mock_get_jwks.assert_called_once()


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_endpoint_get(self):
        """Test health endpoint with GET method."""
        response = client.get("/health")
        
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    def test_health_endpoint_no_auth_required(self):
        """Test that health endpoint doesn't require authentication."""
        response = client.get("/health")
        
        assert response.status_code == 200


class TestRouterInclusion:
    """Tests for router inclusion in main app."""

    def test_text_router_included(self):
        """Test that text router is included."""
        # Check that text generation route exists
        response = client.post(
            "/generate-text",
            json={"text": "test", "model": "gemini"}
        )
        
        # Should return 401 (unauthorized) not 404 (not found)
        # This confirms the route exists
        assert response.status_code in [401, 422]

    def test_image_router_included(self):
        """Test that image router is included."""
        response = client.post(
            "/generate-image",
            json={"model": "huggingface", "prompt": "test"}
        )
        
        # Should return 401 (unauthorized) not 404 (not found)
        assert response.status_code in [401, 422]

    def test_analyze_router_included(self):
        """Test that analyze router is included."""
        response = client.post(
            "/analyze",
            json={"text": "test", "model": "claude"}
        )
        
        # Should return 401 (unauthorized) not 404 (not found)
        assert response.status_code in [401, 422]


class TestRouteTags:
    """Tests for route tags configuration."""

    def test_text_router_has_tag(self):
        """Test that text router routes have correct tags."""
        # Find the text generation route
        for route in app.routes:
            if hasattr(route, 'path') and '/generate-text' in route.path:
                assert hasattr(route, 'tags')
                assert 'Text generation' in route.tags
                break

    def test_image_router_has_tag(self):
        """Test that image router routes have correct tags."""
        for route in app.routes:
            if hasattr(route, 'path') and '/generate-image' in route.path:
                assert hasattr(route, 'tags')
                assert 'Image generation' in route.tags
                break

    def test_analyze_router_has_tag(self):
        """Test that analyze router routes have correct tags."""
        for route in app.routes:
            if hasattr(route, 'path') and '/analyze' in route.path:
                assert hasattr(route, 'tags')
                assert 'Analyze engine' in route.tags
                break


class TestEnvironmentConfiguration:
    """Tests for environment variable configuration."""

    @patch.dict(os.environ, {"ALLOWED_ORIGINS": "http://localhost:3000"})
    def test_single_allowed_origin(self):
        """Test configuration with single allowed origin."""
        import importlib
        import main
        importlib.reload(main)
        
        assert main.ALLOWED_ORIGINS == ["http://localhost:3000"]

    @patch.dict(os.environ, {"ALLOWED_ORIGINS": "http://localhost:3000,https://app.com"})
    def test_multiple_allowed_origins(self):
        """Test configuration with multiple allowed origins."""
        import importlib
        import main
        importlib.reload(main)
        
        assert "http://localhost:3000" in main.ALLOWED_ORIGINS
        assert "https://app.com" in main.ALLOWED_ORIGINS

    @patch.dict(os.environ, {"ALLOWED_ORIGINS": ""})
    def test_empty_allowed_origins_default(self):
        """Test configuration with empty allowed origins uses default."""
        import importlib
        import main
        importlib.reload(main)
        
        # Should default to localhost:3000
        assert main.ALLOWED_ORIGINS == ["http://localhost:3000"]

    @patch.dict(os.environ, {"ALLOWED_ORIGINS": "  http://localhost:3000  ,  https://app.com  "})
    def test_allowed_origins_stripped(self):
        """Test that allowed origins are stripped of whitespace."""
        import importlib
        import main
        importlib.reload(main)
        
        # Check that origins don't have leading/trailing whitespace
        for origin in main.ALLOWED_ORIGINS:
            assert origin == origin.strip()
