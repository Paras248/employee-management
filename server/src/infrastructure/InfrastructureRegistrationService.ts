import { container } from "tsyringe";
import { EmployeeRepository } from "./persistence/repositories/EmployeeRepository";
import { IEmployeeRepository } from "@@domain/contracts/repositories/EmployeeRepository";
import { DbConnectionService } from "./persistence/services/DbConnectionService";

container.register<IEmployeeRepository>(
    "EmployeeRepository",
    EmployeeRepository
);

container.register<DbConnectionService>(
    "DbConnectionService",
    DbConnectionService
);

container.resolve(DbConnectionService);

export { container };
