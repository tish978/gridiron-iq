# Gridiron IQ

**Elite NFL Knowledge. No Casual Fans.**

Gridiron IQ is a high-fidelity, mobile-first web application designed to test elite-level NFL knowledge. Unlike casual trivia apps, Gridiron IQ focuses on tactical nuances, historical records, and "real ball" knowledge, wrapped in a premium, high-contrast aesthetic inspired by modern sports broadcasting.

## 🏗️ Architecture

- **Frontend**: Vanilla JavaScript (ES6+), Tailwind CSS, Mobile-first design
- **Backend**: FastAPI (Python 3.11+), JSON file storage (Phase 1)
- **Deployment**: Railway monorepo (single service)
- **Cost Target**: <$5/month hosting

## 📁 Project Structure

```
gridiron-iq/
├── frontend/
│   ├── index.html              # Main application
│   ├── css/
│   │   └── styles.css          # Custom styles (Tailwind extensions)
│   ├── js/
│   │   ├── app.js              # Main game controller
│   │   ├── api.js              # Backend communication layer
│   │   ├── utils.js            # Helper functions (scoring, formatting)
│   │   └── components.js       # UI component builders
│   └── assets/
│       ├── football.svg        # Brand icon
│       └── favicon.ico
│
├── backend/
│   ├── main.py                 # FastAPI application entry
│   ├── models/
│   │   └── question.py         # Pydantic data models
│   ├── services/
│   │   └── quiz.py             # Business logic (question selection, scoring)
│   ├── data/
│   │   └── questions.json    # Question bank (30 questions)
│   └── requirements.txt        # Python dependencies
│
├── railway.json                # Railway deployment config
├── .gitignore
└── README.md
```

## 🚀 Local Development

### Prerequisites

- Python 3.11+
- pip

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gridiron-iq
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the backend server** (from project root)
   ```bash
   # Make sure you're in the gridiron-iq directory (project root)
   uvicorn backend.main:app --reload --port 8000
   
   # Or use the start script:
   # Windows: start.bat
   # Linux/Mac: ./start.sh
   ```

4. **Access the application**
   - Open your browser to `http://localhost:8000`
   - The FastAPI server serves both API endpoints and static frontend files

### Development Workflow

- **Backend**: FastAPI auto-reloads on file changes (--reload flag)
- **Frontend**: Static files are served directly, refresh browser to see changes
- **API Testing**: Visit `http://localhost:8000/docs` for interactive API documentation

## 🚂 Railway Deployment

### Initial Setup

1. **Install Railway CLI** (optional)
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

Railway will automatically:
- Detect Python project
- Install dependencies from `requirements.txt`
- Run the start command from `railway.json`
- Provide a public URL

### Environment Variables

Railway automatically injects:
- `PORT` - Server port (required)

Optional (for future features):
- `ENVIRONMENT` - Set to `production`

## 🎮 Game Flow

1. **Landing Page**: High-impact branding with "Begin the Drive" CTA
2. **Question Phase**: 4 questions (2 History, 2 Tactical) with progress tracking
3. **Feedback**: Real-time feedback ("TOUCHDOWN" or "INTERCEPTED") with explanations
4. **Results**: Professional grade (Hall of Fame, All-Pro, Pro Bowl, etc.) with breakdown

## 📊 Scoring System

- **Scouter Rating**: 0-100 based on correct answers (25 points per question)
- **Grades**:
  - 90-100: Hall of Fame
  - 75-89: All-Pro
  - 60-74: Pro Bowl
  - 40-59: Solid Starter
  - 20-39: Practice Squad
  - 0-19: Undrafted

## 🎨 Design Philosophy

- **Theme**: Cyber-tactical, high-contrast (Dark mode by default)
- **Colors**:
  - Primary: Lime/Kiwi #e2ff00
  - Background: Deep Black #050505
  - Surface: Charcoal #121212
  - Accent: Electric Blue #00d9ff
  - Error: Crimson Red #ff0033
- **Typography**: Inter (Google Fonts), Black weight (900) for headers
- **Mobile-First**: 100vh viewport optimization

## 📝 API Endpoints

### GET `/api/questions`

Fetch randomized question set.

**Parameters**:
- `count` (optional, default: 4): Number of questions (1-10)
- `categories` (optional): Comma-separated categories (History, Tactical)

**Example**:
```bash
curl http://localhost:8000/api/questions?count=4
```

**Response**:
```json
{
  "questions": [
    {
      "id": "uuid",
      "q": "Question text?",
      "a": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1,
      "type": "History",
      "expl": "Explanation text",
      "difficulty": 5
    }
  ]
}
```

### GET `/health`

Health check endpoint.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Question randomization works
- [ ] Score calculation accurate
- [ ] Grade assignment correct
- [ ] Mobile responsiveness (iPhone, Android)
- [ ] Cross-browser (Chrome, Safari, Firefox)
- [ ] Keyboard navigation (A/B/C/D keys)
- [ ] Loading states
- [ ] Error handling

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules), Tailwind CSS (CDN), Google Fonts
- **Backend**: FastAPI, Pydantic, Uvicorn
- **Storage**: JSON file (Phase 1), PostgreSQL (Phase 2)
- **Deployment**: Railway

## 📈 Roadmap

### Phase 1: MVP ✅
- Core game loop (4 questions)
- Scoring & grading system
- FastAPI backend + JSON storage
- Railway deployment
- Mobile-responsive UI

### Phase 2: Engagement (Week 2)
- User accounts (email-based)
- Persistent high scores
- Global leaderboard
- Social sharing
- 100-question bank

### Phase 3: Advanced Features (Month 1)
- Weekly Challenges
- Multiplayer head-to-head
- Achievements system
- User-generated content

## 📄 License

[Your License Here]

## 👤 Author

[Your Name]

## 🙏 Acknowledgments

- NFL RedZone for design inspiration
- FastAPI for the excellent framework
- Railway for seamless deployment

---

**Status**: ✅ Ready for Development & Deployment
