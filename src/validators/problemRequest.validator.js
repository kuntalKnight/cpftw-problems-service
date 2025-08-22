/**
 * Problem Request Validator
 * Validates problem-related requests using base validator functions
 */
import BaseRequestValidator from './baseRequest.validator.js';
import Joi from 'joi';

class ProblemRequestValidator {
  /**
   * Validate get problems request (with pagination)
   */
  static validateGetProblems(req) {
    const { page, limit, difficulty, category } = req.query;
    
    // Validate pagination
    const paginationValidation = BaseRequestValidator.validatePagination(page, limit);
    if (!paginationValidation.isValid) {
      return paginationValidation;
    }
    
    // Validate difficulty if provided
    if (difficulty !== undefined && difficulty !== null && difficulty !== '') {
      const validDifficulties = ['easy', 'medium', 'hard'];
      const normalizedDifficulty = difficulty.toLowerCase().trim();
      
      if (!validDifficulties.includes(normalizedDifficulty)) {
        return {
          isValid: false,
          errors: [`Invalid difficulty '${difficulty}'. Must be one of: ${validDifficulties.join(', ')}`],
          statusCode: 400
        };
      }
    }
    
    // Validate category if provided
    if (category) {
      const categoryValidation = BaseRequestValidator.validateStringLength(category, 'category', 1, 100);
      if (!categoryValidation.isValid) {
        return categoryValidation;
      }
    }
    
    return { isValid: true };
  }

  /**
   * Validate get problem by ID request
   */
  static validateGetProblemById(req) {
    const { id } = req.params;
    
    // Validate ID is provided
    if (!id) {
      return {
        isValid: false,
        errors: ['Problem ID is required'],
        statusCode: 400
      };
    }
    
    // Validate ID is a positive integer
    const idValidation = BaseRequestValidator.validateNumericRange(id, 'Problem ID', 1);
    if (!idValidation.isValid) {
      return idValidation;
    }
    
    return { isValid: true };
  }

  /**
   * Validate create problem request
   */
  static validateCreateProblem(req) {
    const { title, description, difficulty, category, testCases, constraints } = req.body;
    
    // Define validation schema
    const schema = Joi.object({
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().min(10).max(5000).required(),
      difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
      category: Joi.string().min(1).max(100).required(),
      testCases: Joi.array().items(
        Joi.object({
          input: Joi.string().required(),
          output: Joi.string().required(),
          description: Joi.string().optional()
        })
      ).min(1).required(),
      constraints: Joi.array().items(Joi.string()).optional()
    });
    
    return BaseRequestValidator.validateWithJoi(req.body, schema);
  }

  /**
   * Validate update problem request
   */
  static validateUpdateProblem(req) {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate ID
    const idValidation = this.validateGetProblemById(req);
    if (!idValidation.isValid) {
      return idValidation;
    }
    
    // Validate at least one field to update
    if (Object.keys(updateData).length === 0) {
      return {
        isValid: false,
        errors: ['At least one field must be provided for update'],
        statusCode: 400
      };
    }
    
    // Define validation schema for update (all fields optional)
    const schema = Joi.object({
      title: Joi.string().min(1).max(200).optional(),
      description: Joi.string().min(10).max(5000).optional(),
      difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
      category: Joi.string().min(1).max(100).optional(),
      testCases: Joi.array().items(
        Joi.object({
          input: Joi.string().required(),
          output: Joi.string().required(),
          description: Joi.string().optional()
        })
      ).min(1).optional(),
      constraints: Joi.array().items(Joi.string()).optional()
    });
    
    return BaseRequestValidator.validateWithJoi(updateData, schema);
  }

  /**
   * Validate delete problem request
   */
  static validateDeleteProblem(req) {
    return this.validateGetProblemById(req);
  }

  /**
   * Validate search problems request
   */
  static validateSearchProblems(req) {
    const { query, difficulty, category, page, limit } = req.query;
    
    // Validate search query
    if (!query || query.trim().length === 0) {
      return {
        isValid: false,
        errors: ['Search query is required'],
        statusCode: 400
      };
    }
    
    const queryValidation = BaseRequestValidator.validateStringLength(query, 'Search query', 1, 200);
    if (!queryValidation.isValid) {
      return queryValidation;
    }
    
    // Validate pagination
    const paginationValidation = BaseRequestValidator.validatePagination(page, limit);
    if (!paginationValidation.isValid) {
      return paginationValidation;
    }
    
    // Validate difficulty if provided
    if (difficulty) {
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (!validDifficulties.includes(difficulty.toLowerCase())) {
        return {
          isValid: false,
          errors: [`Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`],
          statusCode: 400
        };
      }
    }
    
    // Validate category if provided
    if (category) {
      const categoryValidation = BaseRequestValidator.validateStringLength(category, 'category', 1, 100);
      if (!categoryValidation.isValid) {
        return categoryValidation;
      }
    }
    
    return { isValid: true };
  }
}

export default ProblemRequestValidator;
