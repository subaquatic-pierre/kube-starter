from datetime import datetime
from pydantic import BaseModel, EmailStr, constr


class User(BaseModel):
    name: str
    email: EmailStr
    hashed_password: str
    disabled: bool = False
    verified: bool = False

    role: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    def to_json(self) -> object:
        json = self.model_dump_json()
        del json["hashed_password"]
        return json
