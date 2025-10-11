import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { rateLimit, createRateLimitHeaders } from '../utils/rateLimit';

// Maximum allowed file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed fields to prevent data leakage
const ALLOWED_FIELDS = [
  'list_place',
  'list_date_time',
  'detail_plaats',
  'detail_datum',
  'stance',
  'language',
  'identifies_as_immigrant'
];

// Valid values for enum fields
const VALID_STANCES = ['For', 'Against', 'Neutral'];
const VALID_LANGUAGES = ['Dutch', 'English', 'Other'];
const VALID_IMMIGRANT_STATUS = ['Yes', 'No', 'Unclear'];

/**
 * Sanitize string to prevent XSS and injection attacks
 */
function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  
  // Remove any HTML tags
  let sanitized = value.replace(/<[^>]*>/g, '');
  
  // Remove potential script injections
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Limit length to prevent DoS
  sanitized = sanitized.substring(0, 500);
  
  return sanitized.trim();
}

/**
 * Validate and sanitize a single row of data
 */
function validateRow(row) {
  const validated = {};
  
  // Only include allowed fields
  for (const field of ALLOWED_FIELDS) {
    if (row.hasOwnProperty(field)) {
      let value = row[field];
      
      // Sanitize string values
      if (typeof value === 'string') {
        value = sanitizeString(value);
      }
      
      // Validate enum fields
      if (field === 'stance' && !VALID_STANCES.includes(value)) {
        value = 'Unknown';
      }
      if (field === 'language' && !VALID_LANGUAGES.includes(value)) {
        value = 'Other';
      }
      if (field === 'identifies_as_immigrant' && !VALID_IMMIGRANT_STATUS.includes(value)) {
        value = 'Unclear';
      }
      
      validated[field] = value;
    }
  }
  
  return validated;
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
    // Read the CSV file from the public directory
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
    
    // Parse CSV to JSON
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    
    // Validate and sanitize all data
    const validatedData = parsedData.data
      .map(validateRow)
      .filter(row => Object.keys(row).length > 0); // Remove empty rows
    
    // Limit response size (max 50000 rows)
    const limitedData = validatedData.slice(0, 50000);
    
    // Return JSON response
    return NextResponse.json({
      success: true,
      data: limitedData,
      total: limitedData.length,
    }, {
      headers: rateLimitHeaders,
    });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load data',
      },
      { 
        status: 500,
        headers: rateLimitHeaders,
      }
    );
  }
}
