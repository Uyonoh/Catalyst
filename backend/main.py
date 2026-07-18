import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from routers import text, image, analyze

app = FastAPI(
    title="Catalyst Backend LLM Inference Service",
    version="1.0.0"
)

# Enable CORS for Next.js app communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to the Next.js origin URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(text.router, prefix="/generate-text", tags=["Text generation"])
app.include_router(image.router, prefix="/generate-image", tags=["Image generation"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze engine"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}
