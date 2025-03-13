// src/utils/validation.util.ts
import { Request } from 'express';
import { AnyZodObject, z } from 'zod';
import { ValidationError } from '../configs/error.config';


export class ValidationUtil {

  static validate<T extends AnyZodObject>(schema: T, data: any): z.infer<T> {
    const validationResult = schema.safeParse(data);
    
    if (!validationResult.success) {
      const errorRecord: Record<string, string> = {};
      
      validationResult.error.errors.forEach(err => {
        const fieldPath = err.path.join('.');
        errorRecord[fieldPath] = err.message;
      });
      
      throw new ValidationError('Validation Error', errorRecord);
    }
    
    return validationResult.data;
  }

 
  static validateBody<T extends AnyZodObject>(req: Request, schema: T): z.infer<T> {
    return this.validate(schema, req.body);
  }

 
  static validateQuery<T extends AnyZodObject>(req: Request, schema: T): z.infer<T> {
    return this.validate(schema, req.query);
  }


  static validateParams<T extends AnyZodObject>(req: Request, schema: T): z.infer<T> {
    return this.validate(schema, req.params);
  }
}