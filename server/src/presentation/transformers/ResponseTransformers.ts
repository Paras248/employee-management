import { Response } from 'express';
import { Response as ApiResponse } from '@@application/responses/Response';

export class ResponseTransformers {
    static success<T>(res: Response, message: string, data: T, statusCode: number = 200): void {
        res.status(statusCode).json(ApiResponse.success(message, data));
    }

    static created<T>(res: Response, message: string, data: T): void {
        this.success(res, message, data, 201);
    }

    static ok<T>(res: Response, message: string, data: T): void {
        this.success(res, message, data, 200);
    }

    static noContent(res: Response, message: string): void {
        this.success(res, message, null, 200);
    }
}
