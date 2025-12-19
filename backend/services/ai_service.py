import json
from core.database import client  # Config se client laye

def get_ai_response(text: str, mode: str, job_desc: str = None):
    # Prompt Logic
    if mode == "roast":
        prompt = f"""
        Act as a savage 'Desi' Stand-up Comedian. Roast this resume in Hinglish.
        RESUME: {text[:3000]}
        OUTPUT JSON: {{ "roast_title": "...", "burns": ["...", "..."], "overall_verdict": "..." }}
        """
        temp = 0.8
    elif mode == "builder":
        prompt = f"""
        Act as a FAANG Resume Writer. Rewrite this for ATS.
        RESUME: {text[:3000]}
        OUTPUT JSON: {{ "personal_info": {{...}}, "skills": [...], "experience": [{{...}}], "education": [{{...}}] }}
        """
        temp = 0.4
    else: 
        prompt = f"""
        Act as a Tech Recruiter. Analyze against JD: {job_desc}.
        RESUME: {text[:3000]}
        OUTPUT JSON: {{ "ats_score": 0-100, "missing_skills": [...], "summary": "...", "improvement_tips": [...] }}
        """
        temp = 0.4

    try:
        response = client.chat.completions.create(
            model="LongCat-Flash-Chat", 
            messages=[{"role": "system", "content": "Output ONLY valid JSON."}, {"role": "user", "content": prompt}],
            temperature=temp,
            max_tokens=1500
        )
        content = response.choices[0].message.content
        return json.loads(content.replace("```json", "").replace("```", "").strip())
    except Exception as e:
        return {"error": str(e)}