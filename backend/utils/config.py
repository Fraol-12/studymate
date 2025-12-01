from pydantic import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    use_local_db: bool = False
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    
    class Config:
        env_file = ".env"


settings = Settings()

