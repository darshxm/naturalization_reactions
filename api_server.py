from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Path to CSV file
CSV_PATH = os.path.join(os.path.dirname(__file__), 'natur_reacties.csv')

@app.route('/api/reactions', methods=['GET'])
def get_reactions():
    """
    Return all reactions data from CSV as JSON
    """
    try:
        # Read CSV file
        df = pd.read_csv(CSV_PATH)
        
        # Convert to list of dictionaries
        reactions = df.to_dict('records')
        
        return jsonify(reactions), 200
    
    except FileNotFoundError:
        return jsonify({'error': 'CSV file not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Return summary statistics
    """
    try:
        df = pd.read_csv(CSV_PATH)
        
        stats = {
            'total': len(df),
            'by_stance': df['stance'].value_counts().to_dict(),
            'by_location': df['list_place'].value_counts().head(10).to_dict()
        }
        
        return jsonify(stats), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("🚀 Starting Flask API server...")
    print(f"📊 Reading data from: {CSV_PATH}")
    app.run(debug=True, port=5000, host='0.0.0.0')
