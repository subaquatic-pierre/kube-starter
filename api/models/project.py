from __future__ import annotations
from typing import List

from schemas.project import ProjectSchema
from bson.objectid import ObjectId
from models.model import DBModel


class Project(ProjectSchema, DBModel):
    @staticmethod
    def _collection_name() -> str:
        return "projects"
