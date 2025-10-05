import { container } from 'tsyringe';
import 'reflect-metadata';

// Command Handlers
import { CreateEmployeeCommandHandler } from './features/employee/commands/createEmployee/CreateEmployeeCommandHandler';
import { UpdateEmployeeCommandHandler } from './features/employee/commands/updateEmployee/UpdateEmployeeCommandHandler';
import { DeleteEmployeeCommandHandler } from './features/employee/commands/deleteEmployee/DeleteEmployeeCommandHandler';

// Query Handlers
import { GetEmployeeQueryHandler } from './features/employee/queries/getEmployee/GetEmployeeQueryHandler';
import { GetAllEmployeesQueryHandler } from './features/employee/queries/getAllEmployees/GetAllEmployeesQueryHandler';
import { SearchEmployeesQueryHandler } from './features/employee/queries/searchEmployees/SearchEmployeesQueryHandler';

// Register Command Handlers
container.register('CreateEmployeeCommandHandler', {
    useClass: CreateEmployeeCommandHandler,
});
container.register('UpdateEmployeeCommandHandler', {
    useClass: UpdateEmployeeCommandHandler,
});
container.register('DeleteEmployeeCommandHandler', {
    useClass: DeleteEmployeeCommandHandler,
});

// Register Query Handlers
container.register('GetEmployeeQueryHandler', {
    useClass: GetEmployeeQueryHandler,
});
container.register('GetAllEmployeesQueryHandler', {
    useClass: GetAllEmployeesQueryHandler,
});
container.register('SearchEmployeesQueryHandler', {
    useClass: SearchEmployeesQueryHandler,
});

export { container };
