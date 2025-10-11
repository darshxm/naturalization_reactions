/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis or Vercel Edge Config
 */

const rateLimitMap = new Map();

// Rate limit configuration
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // Max 30 requests per minute per IP

/**
 * Clean up old entries from the rate limit map
 */
function cleanup() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.resetTime > WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Rate limit middleware
 * @param {Request} request - Next.js request object
 * @returns {Object} { success: boolean, limit: number, remaining: number, reset: number }
 */
export function rateLimit(request) {
  // Get IP address from request
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    'unknown';
  
  const now = Date.now();
  
  // Clean up old entries periodically
  if (Math.random() < 0.1) {
    cleanup();
  }
  
  // Get or create rate limit entry for this IP
  let rateData = rateLimitMap.get(ip);
  
  if (!rateData || now - rateData.resetTime > WINDOW_MS) {
    // Create new rate limit entry
    rateData = {
      count: 0,
      resetTime: now,
    };
    rateLimitMap.set(ip, rateData);
  }
  
  // Increment request count
  rateData.count++;
  
  // Calculate remaining requests
  const remaining = Math.max(0, MAX_REQUESTS - rateData.count);
  const resetIn = Math.ceil((rateData.resetTime + WINDOW_MS - now) / 1000);
  
  // Check if rate limit exceeded
  const success = rateData.count <= MAX_REQUESTS;
  
  return {
    success,
    limit: MAX_REQUESTS,
    remaining,
    reset: resetIn,
  };
}

/**
 * Create rate limit headers
 */
export function createRateLimitHeaders(rateData) {
  return {
    'X-RateLimit-Limit': rateData.limit.toString(),
    'X-RateLimit-Remaining': rateData.remaining.toString(),
    'X-RateLimit-Reset': rateData.reset.toString(),
  };
}
