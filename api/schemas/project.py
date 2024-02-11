from typing import Annotated, List

from pydantic import BaseModel
from models.model import ModelId
from schemas.base import BaseSchema, BaseModelSchema


class CreateProjectReq(BaseSchema):
    content: str | None
    title: str
    description: str
    tags: List[str]
    category: str | None
    www_url: str | None
    github_url: str | None


# Inherit all fields from create project request schema
# plus add id, created_at, updated_at fields inherited
# from BaseSchema. Not used as request body schema for documentation
# purpose as to exclude id from examples in documentation
class ProjectSchema(CreateProjectReq, BaseModelSchema):
    pass


class CreateProjectRes(BaseSchema):
    status: str
    project: ProjectSchema | None


class DeleteProjectRes(BaseSchema):
    status: str
    delete_count: int
