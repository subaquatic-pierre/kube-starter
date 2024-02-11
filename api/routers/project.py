import json
from fastapi import APIRouter, Request, Header
from bson.objectid import ObjectId
from fastapi import APIRouter, Depends, Request, status, HTTPException

from typing import List
from schemas.project import (
    ProjectSchema,
    CreateProjectRes,
    CreateProjectReq,
    DeleteProjectRes,
)
from models.project import Project

router = APIRouter()


@router.get("/")
async def list_projects(req: Request) -> List[ProjectSchema]:
    projects = Project.find_many()
    return [project.to_json() for project in projects]


@router.get("/{id}")
async def get_project(id: str) -> ProjectSchema:
    project = Project.find_one({"_id": ObjectId(id)})
    return project.to_json()


@router.put("/{id}")
async def update_project(id: str, body: ProjectSchema) -> ProjectSchema:
    project = Project.find_one({"_id": ObjectId(id)})
    if project:
        for attr, value in body:
            setattr(project, attr, value)

        result = project.save()
        updated_project = Project.find_one({"_id": result.inserted_id})

        if not result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to update project",
            )

        return updated_project.to_json()

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to update project",
        )


@router.post("/")
async def create_project(body: CreateProjectReq) -> CreateProjectRes:
    data = json.loads(body.model_dump_json())
    project = Project(**data)
    result = project.save()
    new_project = Project.find_one({"_id": result.inserted_id})

    return {"status": "success", "project": new_project.to_json()}


@router.delete("/{id}")
async def delete_project(id: str) -> DeleteProjectRes:
    delete_res = Project.delete(id)

    return {
        "success": "success" if delete_res.acknowledged else "failed",
        "deleted_count": delete_res.deleted_count,
    }
