from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from agent import travel_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.on_event("startup")
async def startup_event():
    # Pre-start the browser to save time on first request
    # await travel_agent.start() # Commented out to avoid instant crash if container not ready
    pass

@app.on_event("shutdown")
async def shutdown_event():
    await travel_agent.stop()

@app.get("/")
def read_root():
    return {"message": "Hello World from Backend"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_messages = [m for m in request.messages if m.role == 'user']
    if not user_messages:
        raise HTTPException(status_code=400, detail="No user message found")
    
    last_message = user_messages[-1].content
    
    # Simple logic: If message contains '探して' or '教えて' or '行き', trigger search
    keywords = ['探して', '教えて', '行きたい', '旅行', 'ホテル', '航空券', 'プラン']
    should_search = any(k in last_message for k in keywords)
    
    # Detect potential location (Very naive implementation)
    # In a real app, use NER (Natural Entity Recognition)
    potential_locations = ["京都", "北海道", "沖縄", "東京", "大阪", "福岡", "札幌", "那覇"]
    location = next((loc for loc in potential_locations if loc in last_message), None)

    response_content = ""
    weather_info = ""
    ics_file = ""
    
    if should_search:
        results = await travel_agent.search_general(last_message + " 旅行 おすすめ")
        
        response_content = f"「{last_message}」についてリサーチしました。\n"
        
        if location:
            # Get weather
            mock_coordinates = {
                "京都": {"lat": 35.0116, "lon": 135.7681},
                "北海道": {"lat": 43.0667, "lon": 141.3500},
                "沖縄": {"lat": 26.2124, "lon": 127.6809},
                "東京": {"lat": 35.6895, "lon": 139.6917},
                "大阪": {"lat": 34.6937, "lon": 135.5023},
                "福岡": {"lat": 33.5904, "lon": 130.4017},
                "札幌": {"lat": 43.0618, "lon": 141.3545},
                "那覇": {"lat": 26.2124, "lon": 127.6809}
            }
            coords = mock_coordinates.get(location)
            if coords:
                try:
                    import httpx
                    async with httpx.AsyncClient() as client:
                        resp = await client.get(
                            f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lon']}&current_weather=true"
                        )
                        if resp.status_code == 200:
                            data = resp.json()
                            weather = data.get("current_weather", {})
                            temp = weather.get("temperature")
                            code = weather.get("weathercode") # Could map code to text
                            weather_info = f"\n\n【{location}の天気】\n気温: {temp}°C"
                except Exception as e:
                    print(f"Weather API error: {e}")

            # Generate ICS mock
            from ics import Calendar, Event
            c = Calendar()
            e = Event()
            e.name = f"{location}旅行"
            e.begin = '2024-03-20 00:00:00' # Mock dates
            e.end = '2024-03-22 00:00:00' 
            c.events.add(e)
            ics_file = str(c)

        if results:
            response_content += "\n【検索結果】\n"
            for i, res in enumerate(results, 1):
                response_content += f"{i}. {res['title']}\n{res['snippet']}\n\n"
        else:
            response_content += "申し訳ありません。良い情報が見つかりませんでした。"
            
        if weather_info:
            response_content += weather_info

    else:
        response_content = f"「{last_message}」ですね。具体的な目的地や予算を教えていただければ、詳しくリサーチします。"
        
    return {
        "id": str(len(request.messages) + 1),
        "role": "assistant",
        "content": response_content,
        "location": location, # Send location for map
        "ics_data": ics_file if ics_file else None
    }
