import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

LONGCAT_API_KEY = os.getenv("LONGCAT_API_KEY")
# ✅ FIX: Updated URL based on official docs
LONGCAT_API_URL = os.getenv("LONGCAT_API_URL", "https://api.longcat.chat/openai/v1/chat/completions")

def get_ai_edits(resume_data: dict, user_prompt: str):
    """
    LongCat API (OpenAI Compatible) used to edit resume.
    """
    if not LONGCAT_API_KEY:
        return {"status": "error", "message": "LongCat API Key is missing in .env"}

    # System instruction (unchanged)
    system_instruction = """
    You are an expert Resume Editor.
    Task: Update the provided Resume JSON based strictly on the User's Instruction.
    
    Rules:
    1. MODIFY only the fields asked by the user. Keep other data exactly same.
    2. IMPROVE grammar and professional tone if applicable.
    3. RETURN ONLY VALID JSON. Do not write 'Here is the JSON' or markdown formatting like ```json.
    """

    # User message construction
    user_message = f"""
    CURRENT RESUME JSON:
    {json.dumps(resume_data)}

    USER INSTRUCTION:
    {user_prompt}

    UPDATED JSON OUTPUT:
    """

    # ✅ FIX: Payload updated based on docs
    payload = {
        "model": "LongCat-Flash-Chat",  # Correct Model Name
        "messages": [
            {"role": "user", "content": system_instruction + "\n\n" + user_message}
        ],
        "max_tokens": 4000, # Safe limit within 8k output
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {LONGCAT_API_KEY}", #
        "Content-Type": "application/json"
    }

    try:
        print(f"📡 Sending request to: {LONGCAT_API_URL}")
        
        # API Call
        response = requests.post(LONGCAT_API_URL, json=payload, headers=headers)
        
        # Error Handling
        if response.status_code != 200:
            print(f"⚠️ API Error: {response.text}")
            return {"status": "error", "message": f"API Error {response.status_code}: {response.text}"}
            
        result_json = response.json()
        
        # ✅ Parsing based on OpenAI Format compatibility
        if "choices" in result_json and len(result_json["choices"]) > 0:
            raw_text = result_json["choices"][0]["message"]["content"]
        else:
            return {"status": "error", "message": "Unexpected response format from LongCat"}

        # Cleaning Markdown
        cleaned_json = raw_text.replace("```json", "").replace("```", "").strip()
        
        # Parse to Dict
        updated_data = json.loads(cleaned_json)
        
        return {"status": "success", "data": updated_data}

    except requests.exceptions.RequestException as e:
        print(f"Network Error: {e}")
        return {"status": "error", "message": f"Network Error: {str(e)}"}
    except json.JSONDecodeError:
        print(f"JSON Error. Raw Text: {raw_text}")
        return {"status": "error", "message": "AI returned invalid JSON."}
    except Exception as e:
        print(f"General Error: {e}")
        return {"status": "error", "message": str(e)}