/**
 * Problem Response Validator
 * Validates and formats problem-related API responses
 */
import BaseResponseValidator from './baseResponse.validator.js';

class ProblemResponseValidator {
  /**
   * Validate and format get problems response
   */
  static validateGetProblemsResponse(problems, page = 1, limit = 10, total = 0) {
    // Validate problems data structure
    if (!Array.isArray(problems)) {
      return BaseResponseValidator.validateErrorResponse(
        'Invalid problems data structure',
        'Invalid response format',
        500
      );
    }

    // Validate each problem has required fields
    const requiredFields = ['title', 'difficulty', 'category'];
    for (const problem of problems) {
      const structureValidation = BaseResponseValidator.validateResponseStructure(problem, requiredFields);
      if (!structureValidation.isValid) {
        return BaseResponseValidator.validateErrorResponse(
          structureValidation.errors,
          'Invalid problem data structure',
          500
        );
      }
    }

    // Return paginated response
    return BaseResponseValidator.validatePaginatedResponse(
      problems,
      page,
      limit,
      total,
      'Problems retrieved successfully'
    );
  }

  /**
   * Validate and format get problem by ID response
   */
  static validateGetProblemByIdResponse(problem) {
    if (!problem) {
      return BaseResponseValidator.validateNotFoundResponse('Problem');
    }

    // Validate problem has required fields
    const requiredFields = ['id', 'title', 'description', 'difficulty', 'category', 'testCases'];
    const structureValidation = BaseResponseValidator.validateResponseStructure(problem, requiredFields);
    if (!structureValidation.isValid) {
      return BaseResponseValidator.validateErrorResponse(
        structureValidation.errors,
        'Invalid problem data structure',
        500
      );
    }

    // Sanitize response (remove any sensitive data)
    const sanitizedProblem = BaseResponseValidator.sanitizeResponse(problem);

    return BaseResponseValidator.validateSuccessResponse(
      sanitizedProblem,
      'Problem retrieved successfully'
    );
  }

  /**
   * Validate and format create problem response
   */
  static validateCreateProblemResponse(problem) {
    if (!problem) {
      return BaseResponseValidator.validateErrorResponse(
        'Failed to create problem',
        'Problem creation failed',
        500
      );
    }

    // Validate created problem has required fields
    const requiredFields = ['id', 'title', 'description', 'difficulty', 'category'];
    const structureValidation = BaseResponseValidator.validateResponseStructure(problem, requiredFields);
    if (!structureValidation.isValid) {
      return BaseResponseValidator.validateErrorResponse(
        structureValidation.errors,
        'Invalid created problem structure',
        500
      );
    }

    // Sanitize response
    const sanitizedProblem = BaseResponseValidator.sanitizeResponse(problem);

    return BaseResponseValidator.validateSuccessResponse(
      sanitizedProblem,
      'Problem created successfully',
      201
    );
  }

  /**
   * Validate and format update problem response
   */
  static validateUpdateProblemResponse(problem) {
    if (!problem) {
      return BaseResponseValidator.validateNotFoundResponse('Problem');
    }

    // Validate updated problem has required fields
    const requiredFields = ['id', 'title', 'description', 'difficulty', 'category'];
    const structureValidation = BaseResponseValidator.validateResponseStructure(problem, requiredFields);
    if (!structureValidation.isValid) {
      return BaseResponseValidator.validateErrorResponse(
        structureValidation.errors,
        'Invalid updated problem structure',
        500
      );
    }

    // Sanitize response
    const sanitizedProblem = BaseResponseValidator.sanitizeResponse(problem);

    return BaseResponseValidator.validateSuccessResponse(
      sanitizedProblem,
      'Problem updated successfully'
    );
  }

  /**
   * Validate and format delete problem response
   */
  static validateDeleteProblemResponse(deleted) {
    if (!deleted) {
      return BaseResponseValidator.validateNotFoundResponse('Problem');
    }

    return BaseResponseValidator.validateSuccessResponse(
      { message: 'Problem deleted successfully' },
      'Problem deleted successfully'
    );
  }

  /**
   * Validate and format search problems response
   */
  static validateSearchProblemsResponse(problems, query, page = 1, limit = 10, total = 0) {
    // Validate problems data structure
    if (!Array.isArray(problems)) {
      return BaseResponseValidator.validateErrorResponse(
        'Invalid search results structure',
        'Invalid response format',
        500
      );
    }

    // Validate each problem has required fields
    const requiredFields = ['id', 'title', 'difficulty', 'category'];
    for (const problem of problems) {
      const structureValidation = BaseResponseValidator.validateResponseStructure(problem, requiredFields);
      if (!structureValidation.isValid) {
        return BaseResponseValidator.validateErrorResponse(
          structureValidation.errors,
          'Invalid problem data structure in search results',
          500
        );
      }
    }

    // Create search metadata
    const searchMetadata = {
      query,
      resultsCount: problems.length,
      totalResults: total
    };

    // Return paginated response with search metadata
    const paginatedResponse = BaseResponseValidator.validatePaginatedResponse(
      problems,
      page,
      limit,
      total,
      'Search completed successfully'
    );

    if (paginatedResponse.isValid) {
      paginatedResponse.response.searchMetadata = searchMetadata;
    }

    return paginatedResponse;
  }

  /**
   * Validate and format error response for problems
   */
  static validateProblemErrorResponse(error, operation = 'operation') {
    if (error.name === 'ValidationError') {
      return BaseResponseValidator.validateValidationErrorResponse(
        error.message,
        `Problem ${operation} validation failed`,
        400
      );
    }

    if (error.name === 'NotFoundError') {
      return BaseResponseValidator.validateNotFoundResponse('Problem');
    }

    if (error.name === 'ConflictError') {
      return BaseResponseValidator.validateConflictResponse(
        `Problem ${operation} conflict: ${error.message}`
      );
    }

    // Default error response
    return BaseResponseValidator.validateErrorResponse(
      error,
      `Problem ${operation} failed`,
      500
    );
  }
}

export default ProblemResponseValidator;
