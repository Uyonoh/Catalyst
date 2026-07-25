from unittest.mock import patch, AsyncMock
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ['SUPABASE_URL'] = 'https://mock.supabase.co'
os.environ['SUPABASE_JWT_SECRET'] = 'mock_secret_key'
os.environ['SUPABASE_JWT_AUDIENCE'] = 'authenticated'

def mock_jwt_decode(token, key, **kwargs):
    print('mock_jwt_decode CALLED!')
    return {'sub': 'test-user-id', 'exp': 9999999999}

def mock_get_unverified_header(token):
    print('mock_get_unverified_header CALLED!')
    return {"alg": "HS256"}

jwt_decode_patcher = patch('jose.jwt.decode', side_effect=mock_jwt_decode)
jwt_header_patcher = patch('jose.jwt.get_unverified_header', side_effect=mock_get_unverified_header)
jwks_patcher = patch('backend.auth.get_jwks', new_callable=AsyncMock, return_value={'keys': []})

jwt_decode_patcher.start()
jwt_header_patcher.start()
jwks_patcher.start()

# Now import
from backend.main import app
from fastapi.testclient import TestClient
client = TestClient(app)

# Test - use a valid JWT format (3 parts separated by dots)
# The token doesn't need to be valid, just properly formatted
response = client.post('/analyze', headers={'Authorization': 'Bearer header.payload.signature'}, json={'text': 'test', 'model': 'claude'})
print(f'Status: {response.status_code}')
print(f'Response: {response.text}')