from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.pdf_service import extract_text_from_pdf
from services.ai_service import get_ai_response
from core.database import supabase

router = APIRouter()

# ---------------------------------------------------------
# 1. PROCESS ENDPOINT (Resume Upload + AI + Save to DB)
# ---------------------------------------------------------
@router.post("/process")
async def process_resume(
    file: UploadFile = File(...), 
    job_description: str = Form(""),
    mode: str = Form("analyze"),
    user_email: str = Form(None) # 👈 User Email yahan receive hoga
):
    # Step 1: PDF se text nikalo
    text = await extract_text_from_pdf(file)

    # Step 2: AI se poocho
    result = get_ai_response(text, mode, job_description)

    # Step 3: Database mein save karo
    try:
        # Score nikalo (Agar analyze mode hai toh score hoga, warna 0)
        score = 0
        if isinstance(result, dict) and "ats_score" in result:
             score = result.get("ats_score", 0)
             
        # Supabase Insert
        data_to_save = {
            "filename": file.filename,
            "mode": mode,
            "ai_score": score,
            "ai_response": result,
            "user_email": user_email # 🔥 Email save ho raha hai
        }
        
        supabase.table("resume_analyses").insert(data_to_save).execute()
        print(f"✅ Data Saved for: {user_email if user_email else 'Anonymous'}")
        
    except Exception as e:
        print(f"⚠️ Database Save Error: {e}")
        # Note: Hum error return nahi kar rahe taaki user ko result dikh jaye
        # bhale hi DB save fail ho jaye.

    return {"mode": mode, "data": result}


# ---------------------------------------------------------
# 2. HISTORY ENDPOINT (Dashboard ke liye data lana)
# ---------------------------------------------------------
@router.get("/history")
async def get_history(user_email: str):
    """
    Supabase se specific user ka data wapis laata hai.
    Latest data sabse upar hoga (descending order).
    """
    if not user_email:
        return {"data": []}

    try:
        response = supabase.table("resume_analyses")\
            .select("*")\
            .eq("user_email", user_email)\
            .order("created_at", desc=True)\
            .execute()
        
        return {"data": response.data}
    except Exception as e:
        print(f"⚠️ History Fetch Error: {e}")
        return {"data": []}