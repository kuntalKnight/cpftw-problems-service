/**
 * Request Logger Middleware
 * Logs incoming requests for monitoring and debugging
 */
const requestLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  
  // Override res.end to log response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

export default requestLoggerMiddleware;
