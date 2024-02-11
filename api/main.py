from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config.settings import settings
from routers import auth, user, index, project

app = FastAPI()

origins = [settings.CLIENT_ORIGIN, "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(index.router, tags=["Index"], prefix="/api")
app.include_router(auth.router, tags=["Auth"], prefix="/api/auth")
app.include_router(user.router, tags=["Users"], prefix="/api/users")
app.include_router(project.router, tags=["Projects"], prefix="/api/projects")


if __name__ == "__main__":
    log_level = "debug" if settings.DEBUG else "info"

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        log_level=log_level,
        reload=settings.DEBUG,
    )
