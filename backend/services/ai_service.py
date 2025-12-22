import json
from core.database import client

def get_ai_response(text: str, mode: str, job_desc: str = None):
    # --- ROAST MODE (Same as before) ---
    if mode == "roast":
        prompt = f"""
        Act as a savage 'Desi' Stand-up Comedian. Roast this resume in Hinglish.
        RESUME: {text[:3000]}
        OUTPUT JSON: {{ "roast_title": "...", "burns": ["...", "..."], "overall_verdict": "..." }}
        """
        temp = 0.8

    # --- BUILDER MODE (Same as before) ---
    elif mode == "builder":
        prompt = f"""
        Act as a FAANG Resume Writer. Rewrite this for ATS.
        RESUME: {text[:3000]}
        OUTPUT JSON: {{ "personal_info": {{...}}, "skills": [...], "experience": [{{...}}], "education": [{{...}}] }}
        """
        temp = 0.4

    # --- 🔥 ANALYZER MODE (NEW STRICT LOGIC) ---
    else: 
        prompt = f"""
        Act as a Senior Tech Recruiter with strict standards. Evaluate this resume against these 4 pillars:
        
        1. Impact (0-25): Are there quantifiable results (numbers, %, $)? Action verbs used?
        2. Keywords (0-25): Are technical skills relevant and well-placed?
        3. Format (0-25): Is contact info clear? Is it readable?
        4. Content (0-25): Grammar, spelling, and clarity.

        RESUME TEXT: {text[:3000]}
        JOB DESCRIPTION (Optional): {job_desc}

        OUTPUT ONLY VALID JSON:
        {{
            "ats_score": (Sum of 4 scores),
            "score_breakdown": {{
                "impact": 0-25,
                "keywords": 0-25,
                "format": 0-25,
                "content": 0-25
            }},
            "missing_skills": ["Skill1", "Skill2"],
            "summary": "Professional summary of the candidate...",
            "improvement_tips": ["Specific tip 1", "Specific tip 2"]
        }}
        """
        temp = 0.3 # Strictness badhane ke liye temperature kam kiya

    try:
        response = client.chat.completions.create(
            model="LongCat-Flash-Chat", 
            messages=[{"role": "system", "content": "Output ONLY valid JSON."}, {"role": "user", "content": prompt}],
            temperature=temp,
            max_tokens=1500,
            timeout=120.0 # Timeout safety
        )
        content = response.choices[0].message.content
        return json.loads(content.replace("```json", "").replace("```", "").strip())
    except Exception as e:
        return {"error": str(e)}