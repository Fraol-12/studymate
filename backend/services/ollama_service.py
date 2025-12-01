import httpx

from utils.config import settings


async def generate_ollama(prompt: str) -> str:
    async with httpx.AsyncClient(base_url=settings.ollama_base_url, timeout=120) as client:
        response = await client.post(
            "/api/generate",
            json={"model": settings.ollama_model, "prompt": prompt, "stream": False},
        )
        response.raise_for_status()
        data = response.json()
        # Ollama returns {"response": "..."} for non-streaming
        return data.get("response", "").strip()


async def chat_with_context(system_prompt: str, user_message: str) -> str:
    prompt = f"{system_prompt}\n\nUser:\n{user_message}"
    return await generate_ollama(prompt)


