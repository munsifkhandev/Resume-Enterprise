from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import resume  # Route import kiya

app = FastAPI(title="Resume AI Enterprise")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Routes
app.include_router(resume.router)

# Root check
@app.get("/")
def home():
    return {"message": "Resume AI API is Running 🚀"}