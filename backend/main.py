import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
from logging_config import setup_logging, LoggingMiddleware, get_logger

# Configure logging from environment variables
log_level = os.environ.get("LOG_LEVEL", "INFO")
log_format = os.environ.get("LOG_FORMAT", "json")  # Use 'text' for development
host = os.environ.get("HOST","127.0.0.1" )
port = os.environ.get("PORT", "8000")  # Use 'text' for development
setup_logging(log_level=log_level, log_format=log_format)

logger = get_logger(__name__)

from auth import get_jwks
from routers import text, image, analyze

app = FastAPI(
    title="Catalyst Backend LLM Inference Service",
    version="1.0.0"
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

logger.info("FastAPI application initialized")

# CORS: read allowed origins from env var (comma-separated list).
# In production set ALLOWED_ORIGINS to your Next.js deployment URL.
# e.g. ALLOWED_ORIGINS=https://your-app.vercel.app
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-fetch JWKS on startup to avoid first-request latency
@app.on_event("startup")
async def startup_event():
    await get_jwks()

# Include routers
app.include_router(text.router, prefix="/generate-text", tags=["Text generation"])
app.include_router(image.router, prefix="/generate-image", tags=["Image generation"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze engine"])

@app.get("/health")
def health_check():
    logger.debug("Health check endpoint called")
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=host, port=int(port), reload=True)
