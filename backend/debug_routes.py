import os
os.environ['SUPABASE_URL'] = 'https://mock.supabase.co'
os.environ['SUPABASE_JWT_SECRET'] = 'mock_secret_key'
os.environ['SUPABASE_JWT_AUDIENCE'] = 'authenticated'

from unittest.mock import patch, AsyncMock
jwt_patch = patch('jose.jwt.decode', return_value={'sub': 'test', 'exp': 9999999999})
header_patch = patch('jose.jwt.get_unverified_header', return_value={'alg': 'HS256'})
jwks_patch = patch('backend.auth.get_jwks', new_callable=AsyncMock, return_value={'keys': []})
jwt_patch.start()
header_patch.start()
jwks_patch.start()

from backend.main import app

for route in app.routes:
    print('Route:', getattr(route, 'path', 'N/A'), 'Methods:', getattr(route, 'methods', 'N/A'))
    if hasattr(route, 'routes'):
        for r in route.routes:
            print('  Subroute:', getattr(r, 'path', 'N/A'), 'Methods:', getattr(r, 'methods', 'N/A'))