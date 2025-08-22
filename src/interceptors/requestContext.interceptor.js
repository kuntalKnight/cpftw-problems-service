/**
 * Request Context Interceptor
 * Embeds request context and metadata in the request object
 */
const requestContextInterceptor = (req, res, next) => {
  try {
    // Initialize request context
    req.requestContext = {
      ...req.requestContext,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      requestId: req.requestId || req.traceId
    };
    
    // Add request start time for performance monitoring
    req.requestStartTime = Date.now();
    
    next();
  } catch (error) {
    console.error('Request context interceptor error:', error);
    next();
  }
};

export default requestContextInterceptor;
