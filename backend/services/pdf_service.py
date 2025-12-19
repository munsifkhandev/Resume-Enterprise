import io
import PyPDF2
from fastapi import UploadFile, HTTPException

async def extract_text_from_pdf(file: UploadFile) -> str:
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        content = await file.read()
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([page.extract_text() for page in reader.pages])
        return text or ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")