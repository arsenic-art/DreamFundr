import type { Request, Response, NextFunction } from "express";

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Skip logging in production for health checks and static assets
  if (isProduction && (req.originalUrl.includes('/health') || req.originalUrl.includes('/favicon'))) {
    return next();
  }

  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log the incoming request
  if (isDevelopment) {
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip || req.connection.remoteAddress}`);
    
    // Log request body for POST/PUT/PATCH requests (but hide sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      const sanitizedBody = { ...req.body };
      
      // Hide sensitive fields
      if (sanitizedBody.password) sanitizedBody.password = '[HIDDEN]';
      if (sanitizedBody.token) sanitizedBody.token = '[HIDDEN]';
      
      console.log(`[${timestamp}] Request Body:`, JSON.stringify(sanitizedBody, null, 2));
    }
    
    // Log query parameters if they exist
    if (Object.keys(req.query).length > 0) {
      console.log(`[${timestamp}] Query Params:`, req.query);
    }
  } else {
    // Production: Only log essential info
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode}`);
  }
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - start;
    const responseTimestamp = new Date().toISOString();
    
    if (isDevelopment) {
      console.log(`[${responseTimestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
      
      // Log response body for errors or if it's small
      if (res.statusCode >= 400 || (body && JSON.stringify(body).length < 500)) {
        const sanitizedResponse = typeof body === 'object' ? { ...body } : body;
        
        // Hide sensitive response data
        if (sanitizedResponse && typeof sanitizedResponse === 'object') {
          if (sanitizedResponse.token) sanitizedResponse.token = '[HIDDEN]';
          if (sanitizedResponse.password) sanitizedResponse.password = '[HIDDEN]';
        }
        
        console.log(`[${responseTimestamp}] Response:`, JSON.stringify(sanitizedResponse, null, 2));
      }
    } else if (res.statusCode >= 400) {
      // Production: Only log errors
      console.error(`[${responseTimestamp}] ERROR ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Error logging middleware
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ERROR ${req.method} ${req.originalUrl}:`);
  console.error(`[${timestamp}] Error Message:`, err.message);
  
  if (isDevelopment) {
    console.error(`[${timestamp}] Stack Trace:`, err.stack);
  }
  
  next(err);
};