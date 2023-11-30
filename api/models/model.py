import json
from typing import List
from abc import ABC, abstractmethod
from pymongo.collection import Collection
from pymongo.results import UpdateResult, DeleteResult
from pydantic import BaseModel, Field
from bson.objectid import ObjectId

from db import db


class ModelId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, *args, **kwargs):
        # if not isinstance(v, ObjectId) or not isinstance(v, ModelId):
        #     raise TypeError("ModelId or ObjectId required")
        if not v:
            return None
        return str(v)


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

        if self.id == None:
            return collection.insert_one(data)

        item = collection.find_one({"_id": ObjectId(self.id)})
        if item:
            return collection.update_one({"_id": ObjectId(self.id)}, {"$set": data})
        else:
            return collection.insert_one(data)

    @classmethod
    def delete(cls, id: str) -> DeleteResult:
        collection = cls._get_collection()
        return collection.delete_many({"_id": ObjectId(id)})

    @classmethod
    def _get_collection(cls) -> Collection:
        collection_name = cls._collection_name()
        collection = db[collection_name]
        return collection

    @abstractmethod
    def _hidden_fields(cls) -> List[str]:
        return []

    @abstractmethod
    def _collection_name() -> str:
        pass
