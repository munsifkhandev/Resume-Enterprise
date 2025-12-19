from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks # 👈 Import BackgroundTasks
from services.pdf_service import extract_text_from_pdf
from services.ai_service import get_ai_response
from core.database import supabase

router = APIRouter()

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

# --- MAIN ENDPOINT ---
@router.post("/process")
async def process_resume(
    background_tasks: BackgroundTasks, # 👈 FastAPI ka Magic Tool
    file: UploadFile = File(...), 
    job_description: str = Form(""),
    mode: str = Form("analyze"),
    user_email: str = Form(None)
):
    # 1. Text Extraction
    text = await extract_text_from_pdf(file)

    # 2. AI Response (Iska wait toh karna hi padega)
    result = get_ai_response(text, mode, job_description)

    # 3. Score Calculation
    score = 0
    if isinstance(result, dict) and "ats_score" in result:
            score = result.get("ats_score", 0)

    # 4. 🔥 FIRE AND FORGET (User wait nahi karega)
    # Humne task ko background queue mein daal diya
    if user_email:
        background_tasks.add_task(save_to_db, file.filename, mode, score, result, user_email)

    # 5. Turant Return karo
    return {"mode": mode, "data": result}

# --- HISTORY ENDPOINT (OPTIMIZED) ---
@router.get("/history")
async def get_history(user_email: str):
    if not user_email: return {"data": []}
    
    try:
        # ⚡ OPTIMIZATION: Sirf zaroori columns maange hain (ai_response hata diya)
        response = supabase.table("resume_analyses")\
            .select("id, filename, ai_score, mode, created_at")\
            .eq("user_email", user_email)\
            .order("created_at", desc=True)\
            .execute()
        
        return {"data": response.data}
    except Exception as e:
        print(f"History Error: {e}")
        return {"data": []}