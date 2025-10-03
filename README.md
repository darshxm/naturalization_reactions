# Naturalization Reactions Dashboard

A beautiful React dashboard for visualizing public opinions on Dutch naturalization term extension.

## 🎯 Features

- **📊 Total Opinion Counter** - Real-time count of all submitted opinions
- **📈 Bar Chart** - Distribution of For/Against stances
- **📉 Timeline Chart** - Growth of opinions over time
- **🗺️ Interactive Map** - Geographic distribution across the Netherlands
- **🎨 Beautiful UI** - Modern design with animations and responsive layout

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Install Python dependencies:**

```bash
pip install flask flask-cors pandas
```

2. **Install frontend dependencies:**

```bash
cd frontend
npm install
```

### Running the Application

1. **Start the Flask API server:**

```bash
python api_server.py
```

The API will run on `http://localhost:5000`

2. **In a new terminal, start the React development server:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

3. **Open your browser and navigate to:**

```
http://localhost:3000
```

## 📁 Project Structure

```
naturalization_reactions/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── StanceBarChart.jsx
│   │   │   ├── TimelineChart.jsx
│   │   │   └── NetherlandsMap.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── api_server.py
├── natur_reacties.csv
└── README.md
```

## 🎨 Technologies Used

- **Frontend:**
  - React 18
  - Recharts (for charts)
  - Leaflet & React-Leaflet (for maps)
  - Axios (for API calls)
  - Vite (build tool)

- **Backend:**
  - Flask
  - Flask-CORS
  - Pandas

## 📊 Available Visualizations

1. **Stats Cards** - Overview of total opinions and distribution
2. **Stance Bar Chart** - Visual comparison of For vs Against
3. **Timeline Chart** - Cumulative growth of opinions over time
4. **Netherlands Map** - Geographic clustering with color-coded markers

## 🔧 API Endpoints

- `GET /api/reactions` - Returns all reaction data
- `GET /api/stats` - Returns summary statistics
- `GET /api/health` - Health check endpoint

## 🎯 Future Enhancements

- Real-time updates using WebSockets
- Additional filters (by date, location, etc.)
- Export functionality for charts
- More detailed analytics

## 📝 License

This project is for educational and analytical purposes.
