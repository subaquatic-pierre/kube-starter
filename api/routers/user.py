from typing import Annotated
from fastapi import APIRouter, Depends, Request
from bson.objectid import ObjectId

from models.user import User
from auth.utils import get_current_user

router = APIRouter()


@router.post("/me")
async def get_me(user: Request):
    return user
