from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.database.database import Base, engine
from app.models.user import User
from app.models.chat import Chat
from app.api.auth import router as auth_router


app = FastAPI(
    title="MindEase AI",
    description="AI Mental Health Counselor API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "Welcome to MindEase AI 🧠"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "application": "MindEase AI"
    }


app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"]
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)