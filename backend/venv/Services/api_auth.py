import os
import requests
from jose import jwt, jwk
from flask import Blueprint, request, jsonify
from Services.models import User
from . import db

auth_bp = Blueprint('auth', __name__)

def verify_auth0_token(token):
    try:
        # Fetch public keys from Auth0 JWKS endpoint
        auth0_domain = os.getenv('AUTH0_DOMAIN')
        public_key_url = f"https://{auth0_domain}/.well-known/jwks.json"
        response = requests.get(public_key_url)
        keys = response.json()['keys']

        # Get the unverified JWT header to extract the key ID (kid)
        unverified_header = jwt.get_unverified_header(token)

        if unverified_header and 'kid' in unverified_header:
            # Find the correct key from the keys list using 'kid'
            rsa_key = {}
            for key in keys:
                if key['kid'] == unverified_header['kid']:
                    rsa_key = key
                    break

            if rsa_key:
                # Convert JWK to PEM format (python-jose handles this internally)
                public_key = jwk.construct(rsa_key)
                payload = jwt.decode(
                    token,
                    public_key,
                    algorithms=["RS256"],
                    audience=os.getenv('AUTH0_CLIENT_ID'),
                    issuer=f"https://{auth0_domain}/"
                )
                return payload  # Return the decoded token payload (user info)
            else:
                print("No matching RSA key found")
                return None
        else:
            print("No 'kid' in header")
            return None
    except Exception as e:
        print(f"Error decoding token: {str(e)}")
        return None

@auth_bp.route('/authorize', methods=['POST'])
def create_user():
    auth_header = request.headers.get("Authorization", None)
    if not auth_header:
        return jsonify({"error": "Missing authorization header"}), 401

    token = auth_header.split(" ")[1]  # Extract token from "Bearer <token>"
    user_info = verify_auth0_token(token)

    if not user_info:
        return jsonify({"error": "Invalid token"}), 403

    email = user_info.get("email")
    first_name = user_info.get("given_name", "Unknown")

    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "User already exists", "user_id":existing_user.id}), 200

    # Create new user
    new_user = User(email=email, first_name=first_name)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201
