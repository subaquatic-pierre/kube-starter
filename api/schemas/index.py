from schemas.base import BaseSchema, BaseModelSchema


class IndexRes(BaseSchema):
    status: str


class IndexReq(BaseSchema):
    name: str
