from schemas.base import BaseSchema


class TokenRes(BaseSchema):
    token: str


class RefreshTokenReq(BaseSchema):
    token: str
