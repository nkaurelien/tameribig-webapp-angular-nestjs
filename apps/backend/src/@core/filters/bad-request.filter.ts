import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

interface ExceptionResponse {
  message: string | ValidationError[];
  statusCode?: number;
  error?: string;
}

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ExceptionResponse;

    if (
      Array.isArray(exceptionResponse.message) &&
      exceptionResponse.message[0] instanceof ValidationError
    ) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      const validationErrors = exceptionResponse.message;
      this.formatValidationErrors(validationErrors);
    }

    response.status(statusCode).json({
      ...exceptionResponse,
      statusCode,
    });
  }

  private formatValidationErrors(validationErrors: ValidationError[]): void {
    for (const validationError of validationErrors) {
      if (validationError.constraints) {
        for (const [constraintKey, constraint] of Object.entries(
          validationError.constraints,
        )) {
          if (!constraint) {
            validationError.constraints[constraintKey] =
              `error.fields.${this.toSnakeCase(constraintKey)}`;
          }
        }
      }
      if (validationError.children && validationError.children.length > 0) {
        this.formatValidationErrors(validationError.children);
      }
    }
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
}
