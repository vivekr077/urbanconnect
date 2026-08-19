import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodObject } from 'zod';

type AnyZodObject = ZodObject<any, any>;

/**
 * Validates request data (body, query, params) against a Zod schema.
 * Pass the validation schema to the controller wrapper.
 * @param schema Zod validation schema
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if ('body' in schema.shape) {
        req.body = parsed.body;
      }
      
      if ('query' in schema.shape) {
        Object.defineProperty(req, 'query', {
          value: parsed.query,
          writable: true,
          configurable: true,
        });
      }
      
      if ('params' in schema.shape) {
        Object.defineProperty(req, 'params', {
          value: parsed.params,
          writable: true,
          configurable: true,
        });
      }
      
      next();
    } catch (error) {
      next(error); // Caught by the centralized error handler
    }
  };
};

export default validate;
