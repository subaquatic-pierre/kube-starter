from datetime import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, Request, status, HTTPException
from bson.objectid import ObjectId

from models.user import User
from schemas.user import UserSchema, UpdateUserReq, DeleteUserRes
from auth.utils import get_token_from_request, hash_password, get_current_user


router = APIRouter()


@router.get("/")
async def list_users(req: Request) -> List[UserSchema]:
    users = User.find_many()
    return [user.to_json() for user in users]


@router.get("/{id}")
async def get_user(id: str) -> UserSchema:
    user = User.find_one({"_id": ObjectId(id)})
    return user.to_json()


@router.put("/{id}")
async def update_user(id: str, body: UpdateUserReq) -> UserSchema:
    user = User.find_one({"_id": ObjectId(id)})
    print(body)
    if user:
        for attr, value in body:
            if value:
                if attr == "password":
                    setattr(user, "hashed_password", hash_password(value))
                else:
                    setattr(user, attr, value)

                user.updated_at = datetime.utcnow()

        result = user.save()
        updated_user = User.find_one({"_id": result.inserted_id})

        if not result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to create user",
            )

        return updated_user.to_json()

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The user belonging to this token no logger exist",
        )


@router.delete("/{id}")
async def delete_user(id: str) -> DeleteUserRes:
    delete_res = User.delete(id)

    return {
        "success": delete_res.acknowledged,
        "deleted_count": delete_res.deleted_count,
    }
