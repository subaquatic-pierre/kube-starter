from typing import Annotated
from datetime import datetime, timedelta
from fastapi import APIRouter, status, Depends, Request, HTTPException

from db import UserCollection
from config.settings import settings
from auth.utils import (
    hash_password,
    authenticate_user,
    create_access_token,
    get_current_user,
)
from models.user import User
from schemas.user import (
    RegisterUserReq,
    RegsiterUserRes,
    LoginUserReq,
    LoginUserRes,
)
from schemas.token import TokenRes, RefreshTokenReq
from auth.utils import get_token_from_request


router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
async def regsiter(body: RegisterUserReq) -> RegsiterUserRes:
    # Check if user already exist
    user = User.find_one({"email": body.email.lower()})
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Account already exist"
        )
    # Compare password and passwordConfirm
    if body.password != body.password_confirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match"
        )

    new_data = {
        "id": None,
        "name": body.name,
        "email": body.email.lower(),
        "verified": True,
        "disabled": False,
        "hashed_password": hash_password(body.password),
        "role": "user",
    }

    new_user = User(**new_data)
    result = new_user.save()
    new_user = User.find_one({"_id": result.inserted_id})

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create user",
        )

    return {"status": "success", "user": new_user.to_json()}


@router.post("/login", response_model=LoginUserRes)
async def login(
    body: LoginUserReq,
) -> LoginUserRes:
    # Check if the user exist
    db_user = User.find_one({"email": body.email.lower()})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )

    # Check if the password is valid
    user = authenticate_user(body.email, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )

    # Create access token
    access_token = create_access_token(
        email=user.email,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # Send both access
    return {"token": access_token, "user": user.to_json()}


@router.get("/refresh-token")
async def refresh_token(req: Request) -> TokenRes:
    token = get_token_from_request(req)
    user = get_current_user(token)

    token = create_access_token(
        email=user.email,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The user belonging to this token no logger exist",
        )

    return {"token": token}


@router.get("/me")
async def get_me(req: Request):
    token = get_token_from_request(req)
    user = get_current_user(token)
    return user.to_json()
