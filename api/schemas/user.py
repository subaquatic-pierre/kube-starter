from datetime import datetime
from pydantic import BaseModel, constr, EmailStr
from bson.objectid import ObjectId

from models.model import ModelId


class UserSchema(BaseModel):
    id: ModelId
    name: str
    email: EmailStr

    disabled: bool = False
    verified: bool = False

    hashed_password: str | None = None
    role: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class RegisterUserReq(BaseModel):
    name: str
    email: str
    password: constr(min_length=8)
    password_confirm: str


class RegsiterUserRes(BaseModel):
    status: str
    user: UserSchema


class LoginUserRes(BaseModel):
    token: str
    user: UserSchema


class LoginUserReq(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UpdateUserReq(BaseModel):
    password: constr(min_length=8) | None = None
    role: str | None = None
    name: str | None = None


class DeleteUserRes(BaseModel):
    success: bool
    deleted_count: int
