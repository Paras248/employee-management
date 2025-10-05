import { Request } from 'express';
import { CreateEmployeeCommand } from '@@application/features/employee/commands/createEmployee/CreateEmployeeCommand';
import { UpdateEmployeeCommand } from '@@application/features/employee/commands/updateEmployee/UpdateEmployeeCommand';
import { DeleteEmployeeCommand } from '@@application/features/employee/commands/deleteEmployee/DeleteEmployeeCommand';
import { GetEmployeeQuery } from '@@application/features/employee/queries/getEmployee/GetEmployeeQuery';
import { GetAllEmployeesQuery } from '@@application/features/employee/queries/getAllEmployees/GetAllEmployeesQuery';
import { SearchEmployeesQuery } from '@@application/features/employee/queries/searchEmployees/SearchEmployeesQuery';
import { BadRequestException } from '@@domain/exceptions/BadRequestException';

export class RequestTransformers {
    static toCreateEmployeeCommand(req: Request): CreateEmployeeCommand {
        const {
            name,
            email,
            address,
            phoneNumber,
            dateOfBirth,
            gender,
            position,
            department,
            hireDate,
        } = req.body;
        return new CreateEmployeeCommand(
            name,
            email,
            address,
            phoneNumber,
            new Date(dateOfBirth),
            gender,
            position,
            department,
            new Date(hireDate)
        );
    }

    static toUpdateEmployeeCommand(req: Request): UpdateEmployeeCommand {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            throw new BadRequestException('Invalid employee ID - must be a valid number');

        const {
            name,
            email,
            address,
            phoneNumber,
            dateOfBirth,
            gender,
            position,
            department,
            hireDate,
        } = req.body;
        return new UpdateEmployeeCommand(
            id,
            name,
            email,
            address,
            phoneNumber,
            new Date(dateOfBirth),
            gender,
            position,
            department,
            new Date(hireDate)
        );
    }

    static toDeleteEmployeeCommand(req: Request): DeleteEmployeeCommand {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            throw new BadRequestException('Invalid employee ID - must be a valid number');
        return new DeleteEmployeeCommand(id);
    }

    static toGetEmployeeQuery(req: Request): GetEmployeeQuery {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            throw new BadRequestException('Invalid employee ID - must be a valid number');
        return new GetEmployeeQuery(id);
    }

    static toGetAllEmployeesQuery(req: Request): GetAllEmployeesQuery {
        return new GetAllEmployeesQuery();
    }

    static toSearchEmployeesQuery(req: Request): SearchEmployeesQuery {
        const searchTerm = req.query.q as string;
        if (!searchTerm || searchTerm.trim() === '') {
            throw new BadRequestException('Search term is required');
        }
        return new SearchEmployeesQuery(searchTerm.trim());
    }
}
