from pydantic import constr, EmailStr
from typing_extensions import Annotated
from pydantic import BaseModel, StringConstraints

from schemas.base import BaseSchema, BaseModelSchema


class UserSchema(BaseModelSchema):
    name: str
    email: EmailStr

    disabled: bool = False
    verified: bool = False

    hashed_password: str | None = None
    role: str | None = None


class RegisterUserReq(BaseSchema):
    name: str
    email: str
    password: Annotated[str, StringConstraints(min_length=8)]
    password_confirm: str


class RegsiterUserRes(BaseSchema):
    status: str
    user: UserSchema | None


class LoginUserRes(BaseSchema):
    token: str
    user: UserSchema | None


class LoginUserReq(BaseSchema):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8)]


class UpdateUserReq(BaseSchema):
    password: Annotated[str, StringConstraints(min_length=8)] | None = None
    role: str | None = None
    name: str | None = None


class DeleteUserRes(BaseSchema):
    status: str
    deleted_count: int
