from pydantic import BaseModel, constr


class CreateUserReq(BaseModel):
    password: constr(min_length=8)
    password_confirm: str


class CreateUserRes(BaseModel):
    status: str
    user: User


class LoginUserRes(BaseModel):
    token: str
    user: User


class LoginUserReq(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
