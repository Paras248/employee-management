import { Request, Response, NextFunction } from 'express';
import { Response as ApiResponse } from '@@presentation/responses/Response';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { BadRequestException } from '@@domain/exceptions/BadRequestException';
import { ILogger } from '@@domain/contracts/external-services/ILogger';
import { container } from 'tsyringe';

// Resolve logger at global level
const logger = container.resolve<ILogger>('ILogger');

export const globalExceptionHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log the error
    logger.error('Global exception caught', {
        error: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    // Handle specific exception types
    if (error instanceof ValidationException) {
        handleValidationException(error, res);
    } else if (error instanceof NotFoundException) {
        handleNotFoundException(error, res);
    } else if (error instanceof BadRequestException) {
        handleBadRequestException(error, res);
    } else {
        handleGenericException(error, res);
    }
};

const handleValidationException = (error: ValidationException, res: Response): void => {
    logger.warn('Validation error occurred', {
        message: error.message,
        errors: error.errors,
    });
    res.status(400).json(ApiResponse.failure(error.message, error.errors));
};

const handleNotFoundException = (error: NotFoundException, res: Response): void => {
    logger.warn('Resource not found', {
        message: error.message,
    });
    res.status(404).json(ApiResponse.failure(error.message, []));
};

const handleBadRequestException = (error: BadRequestException, res: Response): void => {
    logger.warn('Bad request error occurred', {
        message: error.message,
    });
    res.status(400).json(ApiResponse.failure(error.message, []));
};

const handleGenericException = (error: Error, res: Response): void => {
    logger.error('Unexpected error occurred', {
        message: error.message,
        stack: error.stack,
    });
    res.status(500).json(
        ApiResponse.failure('Internal server error', ['An unexpected error occurred'])
    );
};
