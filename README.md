# AI Travel Concierge (Antigravity Voyager)

AI Travel Concierge is an intelligent travel planning assistant that autonomously researches travel information and proposes optimal plans based on ambiguous user requests.

![Demo Screenshot](backend/screenshot.png)

## Features

- **Autonomous Research**:  
  Understands user intent (e.g., "Find a hotel in Kyoto") and autonomously gathers information from the web using a headless browser (Playwright).
- **Interactive Chat UI**:  
  A modern, responsive chat interface built with Next.js and Tailwind CSS.
- **Rich User Experience**:
  - **Weather Integration**: Displays real-time weather for the destination (OpenMeteo API).
  - **Map Visualization**: Embeds Google Maps based on recognized locations.
  - **Calendar Export**: Generates `.ics` files to easily add trips to your calendar.
- **Containerized Architecture**:  
  Fully dockerized environment for easy setup and deployment.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python 3.9), Playwright (Web Scraping)
- **Database**: PostgreSQL (Planned for history storage)
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Na7ti/antigravity-voyager.git
   cd antigravity-voyager
   ```

2. Start the application:
   ```bash
   docker-compose up --build
   ```

3. Open your browser:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Usage

1. Open the chat interface.
2. Type a request like "Find a hotel in Kyoto" or "I want to go to Okinawa".
3. The AI agent will research and provide a summary with hotel options, weather info, map, and a calendar download link.

## Project Structure

```
├── backend/            # FastAPI application & Research Agent
│   ├── agent.py        # Playwright implementations
│   ├── main.py         # API Endpoints
│   └── Dockerfile
├── frontend/           # Next.js application
│   ├── app/            # App router & components
│   └── Dockerfile
└── docker-compose.yml  # Container orchestration
```

## License

MIT
