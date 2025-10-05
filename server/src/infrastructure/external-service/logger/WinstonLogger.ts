import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ILogger } from "@@domain/contracts/external-services/ILogger";
import { singleton } from "tsyringe";

@singleton()
export class WinstonLogger implements ILogger {
    private readonly _logger: winston.Logger;

    constructor() {
        this._logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            transports: [
                // Console transport
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
                // Daily rotate file transport for all logs
                new DailyRotateFile({
                    filename: "logs/app-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    level: "info",
                    maxFiles: "14d", // Keep logs for 14 days
                }),
            ],
        });
    }

    info(message: string): void {
        this._logger.info(message);
    }

    error(message: string): void {
        this._logger.error(message);
    }
}
