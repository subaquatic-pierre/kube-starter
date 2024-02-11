from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status, Request

from auth.context import pwd_context
from db import UserCollection
from models.user import User
from config.settings import settings


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password):
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    user = User.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(email: str, expires_delta: timedelta | None = None) -> str:
    to_encode = {"email": email}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def get_current_user(token: str) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        decoded = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )

        email: str = decoded.get("email")
        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = User.find_one({"email": email})
    if user is None:
        raise credentials_exception

    return user


def get_token_from_request(request: Request) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        _token = request.headers["authorization"]
        token = _token.split(" ")[1]

    except:
        raise credentials_exception

    return token


def authorize_req(request: Request):
    token = get_token_from_request(request)
    user = get_current_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to access resource",
        )
