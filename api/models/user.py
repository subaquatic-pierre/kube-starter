from __future__ import annotations
from typing import List

from schemas.user import UserSchema
from bson.objectid import ObjectId
from models.model import DBModel


class User(UserSchema, DBModel):
    @staticmethod
    def _collection_name() -> str:
        return "users"

    @staticmethod
    def _hidden_fields() -> List[str]:
        return ["hashed_password"]
