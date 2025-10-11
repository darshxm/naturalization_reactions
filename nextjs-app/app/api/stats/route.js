import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'natur_reacties.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    
    const reactions = parsedData.data;
    
    // Calculate statistics
    const total = reactions.length;
    const against = reactions.filter(r => r.stance === 'Against').length;
    const forCount = reactions.filter(r => r.stance === 'For').length;
    const neutral = reactions.filter(r => r.stance === 'Neutral').length;
    
    // Language breakdown
    const languages = {};
    reactions.forEach(r => {
      const lang = r.language || 'Unknown';
      languages[lang] = (languages[lang] || 0) + 1;
    });
    
    // Immigrant identification
    const immigrantStats = {};
    reactions.forEach(r => {
      const status = r.identifies_as_immigrant || 'Unclear';
      immigrantStats[status] = (immigrantStats[status] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        total,
        stance: {
          against,
          for: forCount,
          neutral,
        },
        languages,
        immigrantStats,
      },
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate stats',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
