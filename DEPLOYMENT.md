# Deploying to Vercel

## Prerequisites
- A GitHub account
- A Vercel account (sign up at https://vercel.com)

## Steps to Deploy

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to https://vercel.com and log in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### 3. Important Settings

**Root Directory:** Leave as `.` (root)

**Build Settings:**
- Framework Preset: Other
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`

**Environment Variables:** (if needed)
- Add any environment variables here

## Project Structure

```
├── api/                    # Flask API for Vercel serverless
│   └── index.py
├── frontend/              # React app
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── api_server.py          # Flask API (local development)
├── natur_reacties.csv     # Data file
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel configuration
└── .gitignore
```

## Local Development

**Backend (Flask API):**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python api_server.py
```

**Frontend (React):**
```bash
cd frontend
npm install
npm run dev
```

## Files Created for Deployment

- ✅ `requirements.txt` - Python dependencies for Flask API
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `api/index.py` - Vercel serverless function entry point
- ✅ `.gitignore` - Files to exclude from Git
- ✅ `package.json` - Updated with vercel-build script

## Notes

- The CSV file (`natur_reacties.csv`) will be deployed with the project
- The API runs as a serverless function on Vercel
- The frontend is built as static files and served via Vercel's CDN
- Make sure your `.gitignore` excludes `node_modules/`, `.venv/`, and `__pycache__/`
