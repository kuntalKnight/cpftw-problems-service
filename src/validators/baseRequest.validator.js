/**
 * Base Request Validator
 * Contains reusable validation functions for common request validations
 */
import Joi from 'joi';

class BaseRequestValidator {
  /**
   * Validate required fields
   */
  static validateRequired(data, requiredFields) {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        errors: [`Missing required fields: ${missingFields.join(', ')}`],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate string length
   */
  static validateStringLength(value, fieldName, minLength, maxLength) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        errors: [`${fieldName} must be a string`],
        statusCode: 400
      };
    }
    
    if (value.length < minLength) {
      return {
        isValid: false,
        errors: [`${fieldName} must be at least ${minLength} characters long`],
        statusCode: 400
      };
    }
    
    if (value.length > maxLength) {
      return {
        isValid: false,
        errors: [`${fieldName} must not exceed ${maxLength} characters`],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate numeric range
   */
  static validateNumericRange(value, fieldName, min, max) {
    const num = Number(value);
    
    if (isNaN(num)) {
      return {
        isValid: false,
        errors: [`${fieldName} must be a valid number`],
        statusCode: 400
      };
    }
    
    if (min !== undefined && num < min) {
      return {
        isValid: false,
        errors: [`${fieldName} must be at least ${min}`],
        statusCode: 400
      };
    }
    
    if (max !== undefined && num > max) {
      return {
        isValid: false,
        errors: [`${fieldName} must not exceed ${max}`],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate email format
   */
  static validateEmail(email) {
    const emailSchema = Joi.string().email().required();
    const { error } = emailSchema.validate(email);
    
    if (error) {
      return {
        isValid: false,
        errors: ['Invalid email format'],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate file type
   */
  static validateFileType(file, allowedTypes) {
    if (!file) {
      return {
        isValid: false,
        errors: ['File is required'],
        statusCode: 400
      };
    }
    
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        errors: [`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate file size
   */
  static validateFileSize(file, maxSizeInMB) {
    if (!file) {
      return {
        isValid: false,
        errors: ['File is required'],
        statusCode: 400
      };
    }
    
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        errors: [`File size must not exceed ${maxSizeInMB}MB`],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate UUID format
   */
  static validateUUID(uuid) {
    const uuidSchema = Joi.string().uuid().required();
    const { error } = uuidSchema.validate(uuid);
    
    if (error) {
      return {
        isValid: false,
        errors: ['Invalid UUID format'],
        statusCode: 400
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(page, limit, maxLimit = 100) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    if (pageNum < 1) {
      return {
        isValid: false,
        errors: ['Page number must be at least 1'],
        statusCode: 400
      };
    }
    
    if (limitNum < 1 || limitNum > maxLimit) {
      return {
        isValid: false,
        errors: [`Limit must be between 1 and ${maxLimit}`],
        statusCode: 400
      };
    }
    
    return { 
      isValid: true,
      validatedData: { page: pageNum, limit: limitNum }
    };
  }

  /**
   * Generic Joi validation
   */
  static validateWithJoi(data, schema) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return {
        isValid: false,
        errors,
        statusCode: 400
      };
    }
    
    return { 
      isValid: true,
      validatedData: value
    };
  }
}

export default BaseRequestValidator;
