from pydantic import BaseModel


class TokenRes(BaseModel):
    token: str


class RefreshTokenReq(BaseModel):
    token: str
