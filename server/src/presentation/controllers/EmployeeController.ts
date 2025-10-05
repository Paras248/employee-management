import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { CreateEmployeeCommandHandler } from '@@application/features/employee/commands/createEmployee/CreateEmployeeCommandHandler';
import { UpdateEmployeeCommandHandler } from '@@application/features/employee/commands/updateEmployee/UpdateEmployeeCommandHandler';
import { DeleteEmployeeCommandHandler } from '@@application/features/employee/commands/deleteEmployee/DeleteEmployeeCommandHandler';
import { GetEmployeeQueryHandler } from '@@application/features/employee/queries/getEmployee/GetEmployeeQueryHandler';
import { GetAllEmployeesQueryHandler } from '@@application/features/employee/queries/getAllEmployees/GetAllEmployeesQueryHandler';
import { SearchEmployeesQueryHandler } from '@@application/features/employee/queries/searchEmployees/SearchEmployeesQueryHandler';
import { RequestTransformers } from '../transformers/RequestTransformers';
import { ResponseTransformers } from '../transformers/ResponseTransformers';
import { ILogger } from '@@domain/contracts/external-services/ILogger';

@injectable()
export class EmployeeController {
    constructor(
        @inject('ILogger') private logger: ILogger,
        @inject('GetAllEmployeesQueryHandler')
        private getAllEmployeesQueryHandler: GetAllEmployeesQueryHandler,
        @inject('GetEmployeeQueryHandler')
        private getEmployeeQueryHandler: GetEmployeeQueryHandler,
        @inject('CreateEmployeeCommandHandler')
        private createEmployeeCommandHandler: CreateEmployeeCommandHandler,
        @inject('UpdateEmployeeCommandHandler')
        private updateEmployeeCommandHandler: UpdateEmployeeCommandHandler,
        @inject('DeleteEmployeeCommandHandler')
        private deleteEmployeeCommandHandler: DeleteEmployeeCommandHandler,
        @inject('SearchEmployeesQueryHandler')
        private searchEmployeesQueryHandler: SearchEmployeesQueryHandler
    ) {}

    // GET /api/employees - Get all employees
    async getAllEmployees(req: Request, res: Response): Promise<void> {
        this.logger.info('EmployeeController-getAllEmployees: Inside Controller');

        const employees = await this.getAllEmployeesQueryHandler.handle(
            RequestTransformers.toGetAllEmployeesQuery(req)
        );

        ResponseTransformers.ok(res, 'Employees retrieved successfully', employees);

        this.logger.info('EmployeeController-getAllEmployees: Controller Completed');
    }

    // GET /api/employees/:id - Get employee by ID
    async getEmployeeById(req: Request, res: Response): Promise<void> {
        this.logger.info('EmployeeController-getEmployeeById: Inside Controller');

        const employee = await this.getEmployeeQueryHandler.handle(
            RequestTransformers.toGetEmployeeQuery(req)
        );

        ResponseTransformers.ok(res, 'Employee retrieved successfully', employee);

        this.logger.info('EmployeeController-getEmployeeById: Controller Completed');
    }

    // POST /api/employees - Create new employee
    async createEmployee(req: Request, res: Response): Promise<void> {
        this.logger.info('EmployeeController-createEmployee: Inside Controller');

        const employee = await this.createEmployeeCommandHandler.handle(
            RequestTransformers.toCreateEmployeeCommand(req)
        );

        ResponseTransformers.created(res, 'Employee created successfully', employee);

        this.logger.info('EmployeeController-createEmployee: Controller Completed');
    }

    // PUT /api/employees/:id - Update employee
    async updateEmployee(req: Request, res: Response): Promise<void> {
        this.logger.info('EmployeeController-updateEmployee: Inside Controller');

        const employee = await this.updateEmployeeCommandHandler.handle(
            RequestTransformers.toUpdateEmployeeCommand(req)
        );

        ResponseTransformers.ok(res, 'Employee updated successfully', employee);

        this.logger.info('EmployeeController-updateEmployee: Controller Completed');
    }

    // DELETE /api/employees/:id - Delete employee
    async deleteEmployee(req: Request, res: Response): Promise<void> {
        this.logger.info('EmployeeController-deleteEmployee: Inside Controller');

        await this.deleteEmployeeCommandHandler.handle(
            RequestTransformers.toDeleteEmployeeCommand(req)
        );

        ResponseTransformers.noContent(res, 'Employee deleted successfully');

        this.logger.info('EmployeeController-deleteEmployee: Controller Completed');
    }

    // GET /api/employees/search?q=searchTerm - Search employees by name
    async searchEmployees(req: Request, res: Response): Promise<void> {
        this.logger.info('EmployeeController-searchEmployees: Inside Controller');

        const employees = await this.searchEmployeesQueryHandler.handle(
            RequestTransformers.toSearchEmployeesQuery(req)
        );

        ResponseTransformers.ok(res, 'Employee search completed', employees);

        this.logger.info('EmployeeController-searchEmployees: Controller Completed');
    }
}
