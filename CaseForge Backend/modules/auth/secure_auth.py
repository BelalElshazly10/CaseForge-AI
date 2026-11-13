# modules/auth/secure_auth.py

import os
import time
import bcrypt
import jwt
from dataclasses import dataclass
from typing import Optional

# ----------------------------------------------------------
# Config (no hardcoded secrets for production)
# ----------------------------------------------------------
SECRET_KEY = "superStrongSecretKey123!@#Wow123456789"  # for HS256
JWT_EXP_SECONDS = int(os.environ.get("JWT_EXP", "900"))  # 15 min
LOCKOUT_THRESHOLD = int(os.environ.get("LOCKOUT_THRESHOLD", "5"))
LOCKOUT_WINDOW = int(os.environ.get("LOCKOUT_WINDOW", "30"))  # 5 min

# In-memory store (replace with DB later)
USERS = {}

# ----------------------------------------------------------
# Dataclass for results
# ----------------------------------------------------------
@dataclass
class AuthResult:
    success: bool
    message: str
    token: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None

# ----------------------------------------------------------
# Helper functions
# ----------------------------------------------------------
def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())


def check_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode(), hashed)


def is_locked(user: dict) -> bool:
    return time.time() < user["locked_until"]


def record_failed_attempt(user: dict):
    now = time.time()

    # Reset window
    if user["first_failed"] is None or (now - user["first_failed"] > LOCKOUT_WINDOW):
        user["first_failed"] = now
        user["failed_attempts"] = 1
    else:
        user["failed_attempts"] += 1

    if user["failed_attempts"] >= LOCKOUT_THRESHOLD:
        user["locked_until"] = now + LOCKOUT_WINDOW


# ----------------------------------------------------------
# Register
# ----------------------------------------------------------
def register(email: str, password: str, name: str, role: str = "QA_ENGINEER") -> AuthResult:
    if email in USERS:
        return AuthResult(False, "User already exists")
    print("AUTH REGISTER:", email)
    

    USERS[email] = {
        "name": name,
        "password": hash_password(password),
        "role": role,
        "failed_attempts": 0,
        "first_failed": None,
        "locked_until": 0
    }
    print("USERS AFTER REGISTER:", USERS.keys())

    return AuthResult(True, "Registered successfully")


# ----------------------------------------------------------
# Login
# ----------------------------------------------------------
def login(email: str, password: str) -> AuthResult:
    user = USERS.get(email)
    print("AUTH LOGIN:", email)
    print("USERS BEFORE LOGIN:", USERS.keys())

    # Avoid user enumeration
    if not user:
        time.sleep(0.3)
        return AuthResult(False, "Invalid credentials")

    if is_locked(user):
        return AuthResult(False, "Account locked. Try later.")

    print("PASSWORD MATCH:", check_password(password, user["password"]))
    if not check_password(password, user["password"]):
        record_failed_attempt(user)
        return AuthResult(False, "Invalid credentials")

    # Reset lockout
    user["failed_attempts"] = 0
    user["first_failed"] = None
    user["locked_until"] = 0

    payload = {
        "sub": email,
        "name": user["name"],
        "role": user["role"],
        "iat": int(time.time()),
        "exp": int(time.time()) + JWT_EXP_SECONDS
    }

    # Encode using HS256
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return AuthResult(
    success=True,
    message="Login success",
    token=token,
    name=user["name"],
    email=email,
    role=user["role"]
     )


# ----------------------------------------------------------
# Verify token
# ----------------------------------------------------------
def verify_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
