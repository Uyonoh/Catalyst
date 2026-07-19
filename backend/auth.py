import os
import time
import httpx
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

bearer = HTTPBearer()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "")
# Anon key is required by Supabase to authorize JWKS endpoint requests
SUPABASE_PUBLISHABLE_DEFAULT_KEY = os.environ.get("SUPABASE_PUBLISHABLE_DEFAULT_KEY", "")

# JWKS cache with TTL — keys are rotated by Supabase periodically,
# so we refresh every hour to avoid stale-key auth failures.
_jwks_cache: dict | None = None
_jwks_fetched_at: float = 0.0
JWKS_TTL_SECONDS: int = 3600  # 1 hour


async def get_jwks() -> dict | None:
    global _jwks_cache, _jwks_fetched_at

    now = time.monotonic()
    cache_is_valid = _jwks_cache is not None and (now - _jwks_fetched_at) < JWKS_TTL_SECONDS

    if cache_is_valid:
        return _jwks_cache

    if not SUPABASE_URL:
        return None

    jwks_url = f"{SUPABASE_URL.rstrip('/')}/auth/v1/jwks"
    jwks_url = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"

    # Supabase requires the anon key in the apikey header to access the JWKS endpoint
    headers = {}
    # if SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    #     headers["apikey"] = SUPABASE_PUBLISHABLE_DEFAULT_KEY

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(jwks_url, headers=headers)
            res.raise_for_status()
            _jwks_cache = res.json()
            _jwks_fetched_at = now
            return _jwks_cache
    except Exception as e:
        print(f"Failed to fetch JWKS from Supabase: {e}")
        # Return stale cache on network failure rather than rejecting all requests
        return _jwks_cache


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

    # 1. RS256 path — verify using public JWKS from Supabase (production)
    # 1. Asymmetric Path — Supports both modern ES256 and production RS256 pools
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
                        algorithms=[token_alg], # Dynamically matches ES256 or RS256
                        audience="authenticated"
                    )
                    return payload.get("sub", "")
                except JWTError as e:
                    print(f"{token_alg} validation failed: {e}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",                headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. HS256 path — for local Supabase dev instances that sign with the JWT secret
    if token_alg == "HS256" and SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return payload.get("sub", "")
        except JWTError as e:
            print(f"HS256 validation failed: {e}")

    # 3. No valid path succeeded
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
