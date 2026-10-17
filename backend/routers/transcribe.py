import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from backend.auth import verify_jwt
from backend.logging_config import get_logger
from google import genai
from google.genai import types
import asyncio

router = APIRouter()
logger = get_logger(__name__)

@router.post("")
async def transcribe_audio(file: UploadFile = File(...), user_id: str = Depends(verify_jwt)):
    logger.info(f"Processing audio transcription request from user {user_id}")
    try:
        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file provided")

        # Find a valid Gemini API key
        api_key = None
        for k, v in os.environ.items():
            if (k.startswith("GEMINI_API_KEY") or k.startswith("GOOGLE_GENAI_API_KEY")) and v:
                api_key = v
                break

        if not api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        client = genai.Client(api_key=api_key)
        model_name = os.environ.get("GEMINI_TRANSCRIBE_MODEL", "gemini-3.1-flash-lite")

        def run_genai():
            return client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(
                        data=audio_bytes,
                        mime_type=file.content_type or "audio/webm",
                    ),
                    "Transcribe this audio recording accurately into text. Return only the transcribed text without conversational filler, explanations, or quotes."
                ]
            )

        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(None, run_genai)
        transcript = (response.text or "").strip()

        logger.info(f"Audio transcription completed for user {user_id}")
        return {"transcription": transcript}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error in audio transcription for user {user_id}: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail="Audio transcription failed. Please try again.")
