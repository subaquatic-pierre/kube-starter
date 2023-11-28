from pydantic import BaseModel


class TokenRes(BaseModel):
    token: str
