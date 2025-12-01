from supabase import create_client, Client
from utils.config import settings

_supabase_client: Client = None

def get_supabase() -> Client:
    """Lazy-load Supabase client to avoid errors at import time."""
    global _supabase_client
    if _supabase_client is None:
        url = settings.supabase_url
        key = settings.supabase_key
        
        # Validate URL format
        if not url or url == "your_supabase_url_here" or not url.startswith("https://"):
            raise ValueError(
                f"Invalid SUPABASE_URL: '{url}'. "
                "Please set a valid Supabase URL in your .env file. "
                "Get it from: https://supabase.com/dashboard → Settings → API"
            )
        
        if not key or key == "your_supabase_key_here":
            raise ValueError(
                "Invalid SUPABASE_KEY. "
                "Please set your Supabase anon key in your .env file. "
                "Get it from: https://supabase.com/dashboard → Settings → API"
            )
        
        _supabase_client = create_client(url, key)
    return _supabase_client

# Proxy class to make supabase.table() work seamlessly
class SupabaseProxy:
    def __getattr__(self, name):
        return getattr(get_supabase(), name)

supabase = SupabaseProxy()

