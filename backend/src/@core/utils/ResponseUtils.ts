import {HttpStatus, Response} from '@nestjs/common';

export class ResponseUtils {
    public static sendResponse(
        @Response() res,
        data: any,
        message: string = 'Successful operation',
        status: number = HttpStatus.OK,
    ) {
        return res.status(status).json({
            data,
            message,
            status,
        });
    }

    public static sendCreated(
        @Response() res,
        data: any,
        message: string = 'Successful created',
    ) {
        return res.status(HttpStatus.CREATED).json({
            data,
            message,
            status: HttpStatus.CREATED,
        });
    }

    public static sendNoContent(
        @Response() res,
        data: any,
        message: string = 'Successful operation with no content',
    ) {
        return res.status(HttpStatus.NO_CONTENT).json({
            data,
            message,
            status: HttpStatus.NO_CONTENT,
        });
    }

    public static sendError(
        @Response() res,
        error: any,
        message: string = 'Unexpected Error',
        status: number = 400,
    ) {
        return res.status(status).json({
            error,
            message,
            status,
        });
    }

    public static sendNotFoundError(
        @Response() res,
        message: string = 'Unexpected Client Side Error: Not Found',
    ) {
        return res.status(HttpStatus.NOT_FOUND).json({
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }

    /**
     * Unprocessable entity error from client
     *
     * @param res
     * @param error
     * @param message
     */
    public static sendClientValidationError(
        @Response() res,
        error: any,
        message: string = 'Unexpected Client Side Error: Unprocessable entity',
    ) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            error,
            message,
            status: HttpStatus.UNPROCESSABLE_ENTITY,
        });
    }

    public static sendServerError(
        @Response() res,
        error: any,
        message: string = 'Unexpected Server Side Error',
        status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    ) {
        return res.status(status).json({
            error,
            message,
            status,
        });
    }
}
