from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status

from auth.context import pwd_context
from db import UserCollection
from models.user import User
from config.settings import settings


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password):
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_user(email: str) -> User | None:
    _user = UserCollection.find_one({"email": email})
    if not _user:
        return None

    user = User(**_user)
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


def get_current_user(payload: {"token": str}):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        decoded = jwt.decode(
            payload["token"], settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )

        email: str = decoded.get("email")
        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = get_user(email)
    if user is None:
        raise credentials_exception
    return user
