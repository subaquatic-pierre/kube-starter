from typing import Annotated
from datetime import datetime, timedelta
from fastapi import APIRouter, status, Depends, Request, HTTPException

from db import UserCollection
from config.settings import settings
from auth.utils import (
    hash_password,
    authenticate_user,
    create_access_token,
)
from models.user import User
from schemas.user import CreateUserReq, CreateUserRes, LoginUserReq, LoginUserRes
from schemas.token import TokenRes


router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
async def create_user(payload: CreateUserReq) -> CreateUserRes:
    # Check if user already exist
    user = UserCollection.find_one({"email": payload.email.lower()})
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Account already exist"
        )
    # Compare password and passwordConfirm
    if payload.password != payload.password_onfirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match"
        )

    #  Hash the password
    payload.hashed_password = hash_password(payload.password)
    del payload.password_confirm
    payload.role = "user"
    payload.verified = True
    payload.email = payload.email.lower()
    payload.created_at = datetime.utcnow()
    payload.updated_at = payload.created_at

    new_user = User(**payload)
    result = UserCollection.insert_one(user.to_json())

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create user",
        )

    return {"status": "success", "user": new_user.to_json()}


@router.post("/login", response_model=LoginUserRes)
async def login(
    payload: LoginUserReq,
) -> LoginUserRes:
    # Check if the user exist
    db_user = UserCollection.find_one({"email": payload.email.lower()})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )

    # Check if the password is valid
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )

    # Create access token
    access_token = create_access_token(
        email=user.email,
        expires_time=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # Send both access
    return {"token": access_token, "user": user.to_json()}


@router.post("/refresh")
async def refresh_token(user: Request) -> TokenRes:
    try:
        token = create_access_token(
            email=user.email,
            expires_time=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The user belonging to this token no logger exist",
            )
    except Exception as e:
        error = e.__class__.__name__
        if error == "MissingTokenError":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide refresh token",
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)

    return {"token": token}
