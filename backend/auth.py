import os
import json
import httpx
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

bearer = HTTPBearer()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")

# In memory JWKS cache
jwks_cache = None

async def get_jwks():
    global jwks_cache
    if jwks_cache is not None:
        return jwks_cache

    if not SUPABASE_URL:
        # Fallback to local HMAC verification if JWT secret is set directly
        return None

    jwks_url = f"{SUPABASE_URL.rstrip('/')}/auth/v1/jwks"
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(jwks_url)
            res.raise_for_status()
            jwks_cache = res.json()
            return jwks_cache
    except Exception as e:
        print(f"Failed to fetch JWKS from Supabase: {e}")
        return None

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(bearer)) -> str:
    token = credentials.credentials
    
    # 1. Try to verify using public JWKS (RS256)
    jwks = await get_jwks()
    if jwks:
        try:
            # Jose's jwt.decode automatically validates expiration and audience if specified
            payload = jwt.decode(
                token, 
                jwks, 
                algorithms=["RS256"], 
                audience="authenticated"
            )
            return payload.get("sub", "")
        except JWTError as e:
            pass

    # 2. Fallback to HS256 with JWT Secret if configured (e.g. locally or in staging)
    if SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return payload.get("sub", "")
        except JWTError:
            pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token"
    )
