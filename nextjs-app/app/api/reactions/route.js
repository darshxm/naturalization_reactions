import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    // Read the CSV file from the public directory
    const csvPath = path.join(process.cwd(), 'public', 'natur_reacties.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV to JSON
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    
    // Return JSON response
    return NextResponse.json({
      success: true,
      data: parsedData.data,
      total: parsedData.data.length,
    });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load data',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
