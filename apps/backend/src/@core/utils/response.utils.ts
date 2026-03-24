import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: unknown;
  message: string;
  status: number;
}

export class ResponseUtils {
  static sendResponse<T>(
    res: Response,
    data: T,
    message = 'Successful operation',
    status: number = HttpStatus.OK,
  ): Response {
    return res.status(status).json({
      data,
      message,
      status,
    });
  }

  static sendCreated<T>(
    res: Response,
    data: T,
    message = 'Successfully created',
  ): Response {
    return res.status(HttpStatus.CREATED).json({
      data,
      message,
      status: HttpStatus.CREATED,
    });
  }

  static sendNoContent(
    res: Response,
    message = 'Successful operation with no content',
  ): Response {
    return res.status(HttpStatus.NO_CONTENT).json({
      message,
      status: HttpStatus.NO_CONTENT,
    });
  }

  static sendError(
    res: Response,
    error: unknown,
    message = 'Unexpected Error',
    status = HttpStatus.BAD_REQUEST,
  ): Response {
    return res.status(status).json({
      error,
      message,
      status,
    });
  }

  static sendNotFoundError(res: Response, message = 'Not Found'): Response {
    return res.status(HttpStatus.NOT_FOUND).json({
      message,
      status: HttpStatus.NOT_FOUND,
    });
  }

  static sendValidationError(
    res: Response,
    error: unknown,
    message = 'Validation Error',
  ): Response {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      error,
      message,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }

  static sendServerError(
    res: Response,
    error: unknown,
    message = 'Internal Server Error',
  ): Response {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error,
      message,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
