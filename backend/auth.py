import asyncio
import os
import time
from typing import Any, Dict, Optional

import httpx
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from backend.logging_config import get_logger

bearer = HTTPBearer()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")
SUPABASE_JWT_AUDIENCE = os.environ.get("SUPABASE_JWT_AUDIENCE", "authenticated")
SUPABASE_PUBLISHABLE_DEFAULT_KEY = os.environ.get("SUPABASE_PUBLISHABLE_DEFAULT_KEY", "")

logger = get_logger(__name__)

# JWKS cache with TTL — keys are rotated by Supabase periodically,
# typically every 24-48 hours. We refresh daily to match Supabase rotation.
_jwks_cache: Optional[Dict[str, Any]] = None
_jwks_fetched_at: float = 0.0
JWKS_TTL_SECONDS: int = 86400  # 24 hours


async def get_jwks() -> Optional[Dict[str, Any]]:
    global _jwks_cache, _jwks_fetched_at

    now = time.monotonic()
    cache_is_valid = _jwks_cache is not None and (now - _jwks_fetched_at) < JWKS_TTL_SECONDS

    if cache_is_valid:
        return _jwks_cache

    supabase_url = os.environ.get("SUPABASE_URL", "")
    if not supabase_url:
        return None

    jwks_url = f"{supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"

    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(jwks_url)
                res.raise_for_status()
                _jwks_cache = res.json()
                _jwks_fetched_at = now
                return _jwks_cache
        except Exception as e:
            if attempt == max_retries - 1:
                # Final attempt failed - return stale cache if available
                if _jwks_cache:
                    logger.warning(f"Using stale JWKS cache after {max_retries} fetch failures")
                else:
                    logger.error(f"JWKS fetch failed and no cache available: {e}")
                return _jwks_cache
            await asyncio.sleep(1)


async def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(bearer)) -> str:
    token = credentials.credentials

    # Peek at the token header to determine the signing algorithm
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_alg = unverified_header.get("alg", "")

    # Asymmetric Path — Supports both modern ES256 and production RS256 pools
    if token_alg in ["ES256", "RS256"]:
        jwks = await get_jwks()
        if jwks and "keys" in jwks:
            kid = unverified_header.get("kid")
            public_key = next((k for k in jwks["keys"] if k.get("kid") == kid), None)

            if public_key:
                try:
                    payload = jwt.decode(
                        token,
                        public_key,
                        algorithms=[token_alg],
                        audience=SUPABASE_JWT_AUDIENCE
                    )
                    return payload.get("sub", "")
                except JWTError as e:
                    logger.warning(f"{token_alg} validation failed: {e}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. HS256 path — for local Supabase dev instances that sign with the JWT secret
    if token_alg == "HS256" and SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience=SUPABASE_JWT_AUDIENCE
            )
            return payload.get("sub", "")
        except JWTError as e:
            logger.warning(f"HS256 validation failed: {e}")

    # 3. No valid path succeeded
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
