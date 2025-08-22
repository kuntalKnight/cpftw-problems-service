/**
 * User Context Interceptor
 * Embeds user context and permissions in the request object
 */
const userContextInterceptor = (req, res, next) => {
  try {
    // Add user context if user exists (from auth middleware)
    if (req.user) {
      req.userContext = {
        userId: req.user.id,
        permissions: req.user.permissions || [],
        roles: req.user.roles || [],
        isAuthenticated: true
      };
    } else {
      req.userContext = {
        isAuthenticated: false,
        permissions: [],
        roles: []
      };
    }
    
    next();
  } catch (error) {
    console.error('User context interceptor error:', error);
    next();
  }
};

export default userContextInterceptor;
