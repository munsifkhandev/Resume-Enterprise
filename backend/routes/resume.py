from fastapi import APIRouter, UploadFile, File, Form
from services.pdf_service import extract_text_from_pdf
from services.ai_service import get_ai_response
from core.database import supabase

router = APIRouter()

@router.post("/process")
async def process_resume(
    file: UploadFile = File(...), 
    job_description: str = Form(""),
    mode: str = Form("analyze"),
    user_email: str = Form(None) # 👈 Naya Parameter (Optional)
):
    # 1. Text Extraction (Same)
    text = await extract_text_from_pdf(file)

    # 2. AI Response (Same)
    result = get_ai_response(text, mode, job_description)

    # 3. Save to DB (UPDATED)
    try:
        score = 0
        if isinstance(result, dict) and "ats_score" in result:
             score = result.get("ats_score", 0)
             
        supabase.table("resume_analyses").insert({
            "filename": file.filename,
            "mode": mode,
            "ai_score": score,
            "ai_response": result,
            "user_email": user_email # 🔥 Email bhi save kar rahe hain ab
        }).execute()
        print(f"✅ Data Saved for {user_email}")
    except Exception as e:
        print(f"⚠️ DB Error: {e}")

    return {"mode": mode, "data": result}