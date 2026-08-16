from fastapi import APIRouter, Depends

from app.schemas.chat import ChatRequest
from app.services.gemini_service import ask_gemini
from app.core.security import get_current_user


router = APIRouter()


@router.get("/")
def chat_home():
    return {
        "message": "Chat API is working."
    }


@router.post("/")
def chat(
    request: ChatRequest,
    current_user: str = Depends(get_current_user)
):
    reply = ask_gemini(request.message)

    return {
        "reply": reply,
        "user": current_user
    }