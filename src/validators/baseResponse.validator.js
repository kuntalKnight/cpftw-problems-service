/**
 * Base Response Validator
 * Validates and formats API responses with appropriate status codes
 */
class BaseResponseValidator {
  /**
   * Validate and format success response
   */
  static validateSuccessResponse(data, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: true,
      response,
      statusCode
    };
  }

  /**
   * Validate and format error response
   */
  static validateErrorResponse(error, message = 'Error occurred', statusCode = 500) {
    const response = {
      success: false,
      message,
      error: error.message || error,
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: false,
      response,
      statusCode
    };
  }

  /**
   * Validate and format validation error response
   */
  static validateValidationErrorResponse(errors, message = 'Validation failed', statusCode = 400) {
    const response = {
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: false,
      response,
      statusCode
    };
  }

  /**
   * Validate and format not found response
   */
  static validateNotFoundResponse(resource = 'Resource', statusCode = 404) {
    const response = {
      success: false,
      message: `${resource} not found`,
      error: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: false,
      response,
      statusCode
    };
  }

  /**
   * Validate and format unauthorized response
   */
  static validateUnauthorizedResponse(message = 'Unauthorized access', statusCode = 401) {
    const response = {
      success: false,
      message,
      error: 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: false,
      response,
      statusCode
    };
  }

  /**
   * Validate and format forbidden response
   */
  static validateForbiddenResponse(message = 'Access forbidden', statusCode = 403) {
    const response = {
      success: false,
      message,
      error: 'FORBIDDEN',
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: false,
      response,
      statusCode
    };
  }

  /**
   * Validate and format conflict response
   */
  static validateConflictResponse(message = 'Resource conflict', statusCode = 409) {
    const response = {
      success: false,
      message,
      error: 'CONFLICT',
      timestamp: new Date().toISOString(),
      statusCode
    };

    return {
      isValid: false,
      response,
      statusCode
    };
  }

  /**
   * Validate and format paginated response
   */
  static validatePaginatedResponse(data, page, limit, total, message = 'Success') {
    const response = {
      success: true,
      message,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString(),
      statusCode: 200
    };

    return {
      isValid: true,
      response,
      statusCode: 200
    };
  }

  /**
   * Validate response data structure
   */
  static validateResponseStructure(response, requiredFields = []) {
    if (!response) {
      return {
        isValid: false,
        errors: ['Response is required'],
        statusCode: 500
      };
    }

    const missingFields = [];
    requiredFields.forEach(field => {
      if (response[field] === undefined) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return {
        isValid: false,
        errors: [`Missing required response fields: ${missingFields.join(', ')}`],
        statusCode: 500
      };
    }

    return { isValid: true };
  }

  /**
   * Sanitize response data (remove sensitive information)
   */
  static sanitizeResponse(data, sensitiveFields = ['password', 'token', 'secret']) {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      sensitiveFields.forEach(field => {
        if (sanitized[field] !== undefined) {
          delete sanitized[field];
        }
      });

      // Recursively sanitize nested objects
      Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
          sanitized[key] = this.sanitizeResponse(sanitized[key], sensitiveFields);
        }
      });

      return sanitized;
    }

    return data;
  }
}

export default BaseResponseValidator;
