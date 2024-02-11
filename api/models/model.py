from datetime import datetime
from abc import ABC, abstractmethod
from typing import List, Any
import json
from pymongo.collection import Collection
from pymongo.results import UpdateResult, DeleteResult
from pydantic import BaseModel, Field
from bson.objectid import ObjectId
from pydantic_core import core_schema

from db import db


class ModelId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema(
                [
                    core_schema.is_instance_schema(ObjectId),
                    core_schema.chain_schema(
                        [
                            core_schema.str_schema(),
                            core_schema.no_info_plain_validator_function(cls.validate),
                        ]
                    ),
                ]
            ),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")

        return ObjectId(value)


class DBModel(BaseModel, ABC):
    id: ModelId | None = Field(alias="_id", default=None)

    def to_json(self, show_hidden_fields=False, delete_id=False) -> dict:
        data: dict = json.loads(self.model_dump_json())

        if not show_hidden_fields:
            for val in self._hidden_fields():
                data[val] = None

        if delete_id:
            del data["id"]

        return data

    def save(self) -> UpdateResult:
        collection = self._get_collection()

        data = self.to_json(show_hidden_fields=True, delete_id=True)
        now = datetime.utcnow()

        if self.id == None:
            data["updated_at"] = now
            data["created_at"] = now
            return collection.insert_one(data)

        item = collection.find_one({"_id": ObjectId(self.id)})

        if item:
            data["updated_at"] = now
            return collection.update_one({"_id": ObjectId(self.id)}, {"$set": data})
        else:
            return collection.insert_one(data)

    @classmethod
    def delete(cls, id: str) -> DeleteResult:
        collection = cls._get_collection()
        return collection.delete_many({"_id": ObjectId(id)})

    @classmethod
    def find_one(cls, data: dict) -> Any | None:
        collection = cls._get_collection()
        item = collection.find_one(data)
        if not item:
            return None

        user = cls(id=item["_id"], **item)
        return user

    @classmethod
    def find_many(cls, data: dict = {}) -> List[Any] | None:
        collection = cls._get_collection()

        items = collection.find(data)
        users = [cls(id=item["_id"], **item) for item in items]

        return users

    @classmethod
    def _get_collection(cls) -> Collection:
        collection_name = cls._collection_name()
        collection = db[collection_name]
        return collection

    def _hidden_fields(cls) -> List[str]:
        return []

    @abstractmethod
    def _collection_name() -> str:
        pass
