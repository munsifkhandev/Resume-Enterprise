import os
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

load_dotenv()

# OpenAI Config
client = OpenAI(
    api_key=os.getenv("LONGCAT_API_KEY"), 
    base_url="https://api.longcat.chat/openai/v1" 
)

# Supabase Config
try:
    supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
except Exception as e:
    print(f"❌ Supabase Connection Failed: {e}")
    supabase = None