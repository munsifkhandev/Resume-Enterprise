from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException, Body
from pydantic import BaseModel
from typing import Dict, Any, Optional

# ✅ Services Import
from services.pdf_service import extract_text_from_pdf
from services.ai_service import get_ai_response
from services.chat_service import get_ai_edits  # 👈 Nayi Service Import ki

# ✅ DB Import
from core.database import supabase

router = APIRouter()

# --- INPUT MODEL FOR CHAT ---
class EditRequest(BaseModel):
    resume_data: Dict[str, Any]
    user_prompt: str

# --- HELPER FUNCTION: DB SAVE (BACKGROUND) ---
def save_to_db(filename, mode, score, result, user_email):
    try:
        supabase.table("resume_analyses").insert({
            "filename": filename,
            "mode": mode,
            "ai_score": score,
            "ai_response": result,
            "user_email": user_email
        }).execute()
        print(f"✅ Background Task: Data Saved for {user_email}")
    except Exception as e:
        print(f"⚠️ Background Task Failed: {e}")

# --- 1. PROCESS RESUME (UPLOAD) ---
@router.post("/process")
async def process_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    job_description: str = Form(""),
    mode: str = Form("analyze"),
    user_email: str = Form(None)
):
    # 1. Text Extraction
    text = await extract_text_from_pdf(file)

    # 2. AI Response
    result = get_ai_response(text, mode, job_description)

    # 3. Score Calculation
    score = 0
    if isinstance(result, dict) and "ats_score" in result:
            score = result.get("ats_score", 0)

    # 4. Background Save
    if user_email:
        background_tasks.add_task(save_to_db, file.filename, mode, score, result, user_email)

    # 5. Return Result
    return {"mode": mode, "data": result}

# --- 2. AI EDIT / CHAT (NEW ROUTE) 🚀 ---
@router.post("/ai-edit")
async def ai_edit_resume(request: EditRequest):
    """
    Frontend se Resume + Prompt aayega -> AI update karega -> Naya JSON wapas jayega.
    """
    result = get_ai_edits(request.resume_data, request.user_prompt)
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return {"status": "success", "updated_data": result["data"]}

# --- 3. HISTORY ENDPOINT ---
@router.get("/history")
async def get_history(user_email: str):
    if not user_email: return {"data": []}
    
    try:
        response = supabase.table("resume_analyses")\
            .select("id, filename, ai_score, mode, created_at")\
            .eq("user_email", user_email)\
            .order("created_at", desc=True)\
            .execute()
        
        return {"data": response.data}
    except Exception as e:
        print(f"History Error: {e}")
        return {"data": []}