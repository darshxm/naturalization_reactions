import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { rateLimit, createRateLimitHeaders } from '../utils/rateLimit';

// Maximum allowed file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Valid values for enum fields
const VALID_STANCES = ['For', 'Against', 'Neutral'];
const VALID_LANGUAGES = ['Dutch', 'English', 'Other'];
const VALID_IMMIGRANT_STATUS = ['Yes', 'No', 'Unclear'];

/**
 * Safely increment counter for valid values only
 */
function safeIncrement(obj, key, validValues) {
  if (validValues.includes(key)) {
    obj[key] = (obj[key] || 0) + 1;
  } else {
    obj['Unknown'] = (obj['Unknown'] || 0) + 1;
  }
}

export async function GET(request) {
  // Apply rate limiting
  const rateLimitResult = rateLimit(request);
  const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
  
  // Check if rate limit exceeded
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${rateLimitResult.reset} seconds.`,
      },
      { 
        status: 429,
        headers: rateLimitHeaders,
      }
    );
  }
  
  try {
    const csvPath = path.join(process.cwd(), 'public', 'natur_reacties.csv');
    
    // Check file size to prevent DoS
    const stats = fs.statSync(csvPath);
    if (stats.size > MAX_FILE_SIZE) {
      console.error('CSV file too large:', stats.size);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Data file too large',
        },
        { status: 507 }
      );
    }
    
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    
    const reactions = parsedData.data;
    
    // Calculate statistics with validation
    const total = reactions.length;
    
    // Initialize counters
    const stanceStats = { For: 0, Against: 0, Neutral: 0, Unknown: 0 };
    const languages = {};
    const immigrantStats = {};
    
    // Count with validation
    reactions.forEach(r => {
      // Stance counting
      const stance = r.stance || 'Unknown';
      safeIncrement(stanceStats, stance, VALID_STANCES);
      
      // Language counting
      const lang = r.language || 'Unknown';
      safeIncrement(languages, lang, VALID_LANGUAGES);
      
      // Immigrant status counting
      const immigrantStatus = r.identifies_as_immigrant || 'Unclear';
      safeIncrement(immigrantStats, immigrantStatus, VALID_IMMIGRANT_STATUS);
    });
    
    // Clean up Unknown if zero
    if (stanceStats.Unknown === 0) delete stanceStats.Unknown;
    if (languages.Unknown === 0) delete languages.Unknown;
    
    return NextResponse.json({
      success: true,
      stats: {
        total,
        stance: stanceStats,
        languages,
        immigrantStats,
      },
    }, {
      headers: rateLimitHeaders,
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate stats',
      },
      { 
        status: 500,
        headers: rateLimitHeaders,
      }
    );
  }
}
