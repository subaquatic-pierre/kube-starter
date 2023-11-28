from pydantic import BaseModel


class IndexRes(BaseModel):
    status: str


class IndexReq(BaseModel):
    name: str
