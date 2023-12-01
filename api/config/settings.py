import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

    DB_HOST: str = os.getenv("MONGODB_HOST")
    DB_PORT: int = int(os.getenv("MONGODB_PORT"))
    DB_NAME: str = os.getenv("MONGODB_DB_NAME")

    DB_USER: str = os.getenv("MONGODB_USER")
    DB_PASSWORD: str = os.getenv("MONGODB_PASSWORD")

    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRES_IN", 30))
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM")

    CLIENT_ORIGIN: str = os.getenv("CLIENT_ORIGIN")
    DEBUG: bool = os.getenv("ENV", "dev") == "dev"


settings = Settings()
