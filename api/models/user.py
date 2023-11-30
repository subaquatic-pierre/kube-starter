from __future__ import annotations
from typing import List

from schemas.user import UserSchema
from bson.objectid import ObjectId
from models.model import DBModel


class User(UserSchema, DBModel):
    @classmethod
    def find_one(cls, data: dict) -> User | None:
        collection = cls._get_collection()
        item = collection.find_one(data)
        if not item:
            return None

        user = User(id=item["_id"], **item)
        return user

    @classmethod
    def find_many(cls, data: dict = {}) -> List[User] | None:
        collection = cls._get_collection()

        items = collection.find(data)
        users = [User(id=item["_id"], **item) for item in items]

        return users

    @staticmethod
    def _collection_name() -> str:
        return "users"

    @staticmethod
    def _hidden_fields() -> List[str]:
        return ["hashed_password"]
