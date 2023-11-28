from fastapi import APIRouter, Request, Header

from schemas.index import IndexRes, IndexReq

router = APIRouter()


@router.get("/")
async def index(req: Request, body: IndexReq) -> IndexRes:
    print("headers", req.headers.items())
    print("body", body)

    return {"status": "ok"}


@router.get("/health-check")
async def health_check():
    return {"message": "Welcome to fastapi with MongoDB"}
