from datetime import datetime
from pydantic import BaseModel, ConfigDict
from models.model import ModelId
from pydantic.alias_generators import to_camel


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class BaseModelSchema(BaseSchema):
    id: ModelId | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
