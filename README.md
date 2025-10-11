# Naturalization Reactions Dashboard

A modern fullstack Next.js dashboard for analyzing public opinions on Dutch naturalization term extension, with automated daily data updates via GitHub Actions.

## 🎯 Features

- **📊 Real-time Analytics** - Interactive visualizations of 10K+ public opinions
- **📈 Stance Distribution** - Bar charts showing For/Against breakdown
- **📉 Timeline Analysis** - Cumulative opinion growth over time
- **🗺️ Interactive Map** - Geographic distribution across Netherlands
- **🗣️ Language Analysis** - Dutch vs English opinion breakdown
- **🤖 Automated Updates** - Daily data refresh at 9 PM CET via GitHub Actions
- **⚡ Fast Performance** - Next.js API Routes with edge caching
- **🎨 Modern UI** - Responsive design with animations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  AUTOMATED DAILY PIPELINE (GitHub Actions)          │
│  Runs at 9:00 PM CET                                │
│    → Scrape website (main_batched.py)               │
│    → AI analysis (analytics.py)                     │
│    → Transform data (transform_data.py)             │
│    → Update CSV                                     │
│    → Git commit & push                              │
└───────────────┬─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│  VERCEL AUTO-DEPLOYMENT                             │
│    → Detects new commit                             │
│    → Rebuilds Next.js app                           │
│    → Deploys to edge network                        │
└───────────────┬─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────┐
│  NEXT.JS APPLICATION                                │
│    → API Routes serve CSV data as JSON              │
│    → React components render charts                 │
│    → Users see updated opinions                     │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### For Local Development

```bash
# 1. Install Next.js dependencies
cd nextjs-app
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# → http://localhost:3000
```

### For Data Pipeline (Manual Run)

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Run complete pipeline
python pipeline.py
```

## 📁 Project Structure

```
naturalization_reactions/
├── .github/
│   └── workflows/
│       └── daily-pipeline.yml     # 🤖 Daily automation config
├── nextjs-app/                    # 🎨 Next.js application
│   ├── app/
│   │   ├── api/
│   │   │   ├── reactions/         # API endpoint for all data
│   │   │   └── stats/             # API endpoint for statistics
│   │   ├── components/            # React components
│   │   │   ├── StatsCard.jsx
│   │   │   ├── StanceBarChart.jsx
│   │   │   ├── TimelineChart.jsx
│   │   │   ├── NetherlandsMap.jsx
│   │   │   ├── LanguageStatsCard.jsx
│   │   │   └── LanguageStanceCard.jsx
│   │   ├── page.js                # Main dashboard page
│   │   ├── layout.js              # Root layout
│   │   └── globals.css            # Styles
│   ├── public/
│   │   └── natur_reacties.csv     # 📊 Data source
│   ├── package.json
│   └── README.md
├── pipeline.py                    # 🔄 Pipeline orchestrator
├── main_batched.py                # 🕷️ Web scraper
├── analytics.py                   # 🤖 AI opinion analyzer
├── transform_data.py              # 🔧 Data transformer
├── requirements.txt               # 🐍 Python dependencies
├── natur_reacties.csv             # 📊 Generated data
└── vercel.json                    # ⚙️ Vercel configuration
```

## 🎨 Technology Stack

### Frontend & Backend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Recharts** - Chart visualizations
- **Leaflet** - Interactive maps
- **PapaParse** - CSV parsing

### Data Pipeline
- **Python 3.11** - Data processing
- **BeautifulSoup4** - Web scraping
- **Google Gemini** - AI opinion analysis
- **Pandas** - Data manipulation

### Infrastructure
- **Vercel** - Hosting & deployment
- **GitHub Actions** - Scheduled automation
- **Git** - Version control & data persistence

## 📊 API Endpoints

### `GET /api/reactions`

Returns all reaction data from CSV as JSON.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "list_name": "Anoniem",
      "list_place": "Amsterdam",
      "stance": "Against",
      "language": "Dutch",
      ...
    }
  ],
  "total": 10311
}
```

### `GET /api/stats`

Returns aggregated statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10311,
    "stance": { "against": 9876, "for": 234, "neutral": 201 },
    "languages": { "Dutch": 8500, "English": 1700 },
    "immigrantStats": { "Yes": 3200, "Unclear": 5611 }
  }
}
```

## 🤖 Automated Pipeline

The data pipeline runs **automatically every day at 9:00 PM CET** via GitHub Actions.

### What It Does

1. **Scrapes** new opinions from internetconsultatie.nl
2. **Analyzes** opinions using Google Gemini AI
3. **Transforms** data into CSV format
4. **Copies** CSV to Next.js public folder
5. **Commits** changes to GitHub
6. **Triggers** Vercel auto-deployment

### Manual Trigger

You can manually trigger the pipeline:

**Via GitHub:**
1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Daily Data Pipeline"
4. Click "Run workflow"

**Via Local:**
```bash
python pipeline.py
```

## 🌐 Deployment

### Deploy to Vercel (One-Time Setup)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **Set Root Directory:** `nextjs-app`
   - Click "Deploy"

3. **Done!** Your app is live. Future git pushes auto-deploy.

### Auto-Deployment Flow

```
Pipeline runs → 
  CSV updated → 
    Git commit → 
      Vercel detects change → 
        Rebuilds → 
          Deploys → 
            ✨ Live!
```

## 🔧 Configuration

### Change Schedule Time

Edit `.github/workflows/daily-pipeline.yml`:

```yaml
schedule:
  - cron: '0 20 * * *'  # 8 PM UTC = 9 PM CET
```

**Cron format:** `minute hour day month weekday`
- `0 20` = 8:00 PM UTC (9 PM CET in winter)
- Use [crontab.guru](https://crontab.guru) to test

### Add API Keys

If your pipeline uses API keys (e.g., Google Gemini):

1. GitHub repo → **Settings → Secrets → Actions**
2. Add secret: `GOOGLE_API_KEY`
3. It's already referenced in the workflow

## 📚 Documentation

- **`QUICKSTART.md`** - Quick reference guide
- **`CLEANUP_COMPLETE.md`** - Detailed setup explanation
- **`nextjs-app/README.md`** - Next.js app specific docs

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Pipeline fails | Check GitHub Actions logs |
| Data not updating | Verify pipeline ran, check Vercel deployment |
| CSV not found error | Ensure pipeline completed successfully |
| Map not loading | Leaflet needs dynamic import (already configured) |

## 🎯 Why This Architecture?

### CSV Instead of Database

- ✅ **Static historical data** - No real-time updates needed
- ✅ **Read-only** - No user modifications
- ✅ **Perfect size** - ~10K records, fast to parse
- ✅ **Version controlled** - Git tracks all changes
- ✅ **Zero cost** - No database hosting fees
- ✅ **Simple** - No migrations, connections, or overhead

### GitHub Actions Instead of Vercel Cron

- ✅ **Python support** - Vercel can't run Python
- ✅ **Free** - 2000 minutes/month for public repos
- ✅ **Flexible** - Full control over environment
- ✅ **Git integration** - Automatic commits

### Next.js API Routes Instead of Flask

- ✅ **Single deployment** - No separate backend
- ✅ **Edge caching** - Faster response times
- ✅ **Serverless** - Auto-scaling
- ✅ **Type safety** - Better DX with TypeScript (optional)

## 📝 License

This project is for educational and analytical purposes.

## 🙏 Acknowledgments

Data source: [Internet Consultatie - Naturalisatietermijn](https://internetconsultatie.nl/naturalisatietermijn/b1)
