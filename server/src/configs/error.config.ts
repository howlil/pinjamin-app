export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      this.name = this.constructor.name;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
      super(message, 400);
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
    }
  }
  
  export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
      super(message, 403);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
      super(message, 404);
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
      super(message, 409);
    }
  }
  
  export class ValidationError extends AppError {
    errors: Record<string, string>;
  
    constructor(message = 'Validation Error', errors: Record<string, string> = {}) {
      super(message, 400);
      this.errors = errors;
    }
  }
  
  export class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
      super(message, 500, false);
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message = 'Database Error') {
      super(message, 500, false);
    }
  }