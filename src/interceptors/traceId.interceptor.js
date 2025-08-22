/**
 * Trace ID Interceptor
 * Embeds a unique trace ID in the request for tracking
 */
import { v4 as uuidv4 } from 'uuid';

const traceIdInterceptor = (req, res, next) => {
  try {
    // Generate or extract trace ID
    const traceId = req.headers['x-trace-id'] || uuidv4();
    
    // Embed trace ID in request object
    req.traceId = traceId;
    
    // Add trace ID to response headers
    res.setHeader('x-trace-id', traceId);
    
    // Add trace ID to request context for logging
    req.requestContext = {
      ...req.requestContext,
      traceId
    };
    
    next();
  } catch (error) {
    console.error('Trace ID interceptor error:', error);
    next();
  }
};

export default traceIdInterceptor;
