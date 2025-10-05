import { container } from "tsyringe";
import { EmployeeRepository } from "./persistence/repositories/EmployeeRepository";
import { IEmployeeRepository } from "@@domain/contracts/repositories/EmployeeRepository";
import { DbConnectionService } from "./persistence/services/DbConnectionService";
import { WinstonLogger } from "./external-service/logger/WinstonLogger";
import { ILogger } from "@@domain/contracts/external-services/ILogger";

container.register<IEmployeeRepository>(
    "EmployeeRepository",
    EmployeeRepository
);

container.register<DbConnectionService>(
    "DbConnectionService",
    DbConnectionService
);

container.register<ILogger>("ILogger", WinstonLogger);

container.resolve("DbConnectionService");
container.resolve("ILogger");

export { container };
