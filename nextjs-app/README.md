# Naturalization Reactions Dashboard - Next.js

A modern fullstack Next.js dashboard for visualizing public opinions on Dutch naturalization term extension, served via Next.js API Routes.

## 🎯 Features

- **📊 Total Opinion Counter** - Real-time count of all submitted opinions
- **📈 Bar Chart** - Distribution of For/Against stances
- **📉 Timeline Chart** - Growth of opinions over time
- **🗺️ Interactive Map** - Geographic distribution across the Netherlands
- **🌐 Next.js API Routes** - Efficient server-side CSV data serving
- **🎨 Beautiful UI** - Modern design with animations and responsive layout

## 🏗️ Architecture

- **Frontend**: React with Next.js 14 App Router
- **Data Source**: CSV file (`natur_reacties.csv`)
- **API**: Next.js API Routes (`/api/reactions`, `/api/stats`)
- **Deployment**: Optimized for Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to the Next.js app directory:**

```bash
cd nextjs-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to `http://localhost:3000`

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── api/
│   │   ├── reactions/
│   │   │   └── route.js       # Main API endpoint for all reactions
│   │   └── stats/
│   │       └── route.js       # Statistics API endpoint
│   ├── components/
│   │   ├── StatsCard.jsx
│   │   ├── StanceBarChart.jsx
│   │   ├── TimelineChart.jsx
│   │   ├── NetherlandsMap.jsx
│   │   ├── LanguageStatsCard.jsx
│   │   ├── LanguageStanceCard.jsx
│   │   └── ImmigrantStanceCard.jsx
│   ├── page.js                # Main page component
│   ├── layout.js              # Root layout
│   └── globals.css            # Global styles
├── public/
│   └── natur_reacties.csv     # Your data file
├── package.json
└── next.config.mjs
```

## 🎨 Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Recharts** - Chart visualizations
- **Leaflet & React-Leaflet** - Interactive maps
- **PapaParse** - CSV parsing
- **Vercel Analytics** - Analytics tracking

## 🔧 API Endpoints

### GET `/api/reactions`

Returns all reaction data from the CSV file.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 10311
}
```

### GET `/api/stats`

Returns aggregated statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10311,
    "stance": {
      "against": 9876,
      "for": 234,
      "neutral": 201
    },
    "languages": {...},
    "immigrantStats": {...}
  }
}
```

## 📊 Why CSV Instead of Database?

For this use case, serving CSV via Next.js API Routes is ideal because:

1. **Static Data**: The consultation data is historical and doesn't change
2. **Read-Only**: No need for create/update/delete operations
3. **Simplicity**: No database setup, migrations, or connection management
4. **Performance**: Next.js efficiently caches API responses
5. **Cost**: No database hosting costs
6. **Deployment**: Easy one-click deployment to Vercel

## 🚀 Deployment to Vercel

1. **Push your code to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel:**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Set the **Root Directory** to `nextjs-app`
- Click "Deploy"

That's it! Vercel will automatically:
- Detect Next.js
- Build your app
- Deploy with CDN
- Provide a production URL

## 🔄 Updating Data

To update the data:

1. Replace `public/natur_reacties.csv` with your new CSV file
2. Push to GitHub (if deployed)
3. Vercel will auto-deploy the update

## 🎯 Future Enhancements

- Add data filters (by date, location, stance)
- Export charts as images
- More detailed analytics
- Search functionality
- Pagination for large datasets

## 📝 License

This project is for educational and analytical purposes.
