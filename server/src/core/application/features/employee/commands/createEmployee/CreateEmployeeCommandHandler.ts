import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { Employee } from '@@domain/entities/Employee';
import { CreateEmployeeCommand } from './CreateEmployeeCommand';
import { CreateEmployeeValidator } from './CreateEmployeeValidator';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { ILogger } from '@@domain/contracts/external-services/ILogger';
import { EmployeeDto } from '@@application/common/dtos/EmployeeDto';
import { EmployeeMapper } from '@@application/common/mappers/EmployeeMapper';

@injectable()
export class CreateEmployeeCommandHandler {
    constructor(
        @inject('IEmployeeRepository')
        private employeeRepository: IEmployeeRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async handle(command: CreateEmployeeCommand): Promise<EmployeeDto> {
        this.logger.info('CreateEmployeeCommandHandler-handle: Inside Handler', {
            name: command.name,
            email: command.email,
        });

        // Validate the command
        const validation = CreateEmployeeValidator.validate(command);

        if (!validation.isValid) {
            throw new ValidationException('Invalid employee data', validation.errors);
        }

        // Check if employee with same email already exists
        const existingEmployee = await this.employeeRepository.findByEmailAsync(command.email);

        if (existingEmployee) {
            throw new ValidationException('Employee with this email already exists', [
                'Email must be unique',
            ]);
        }

        // Create new employeex
        const employee = new Employee(
            0, // ID will be set by the database
            command.email,
            command.name,
            command.address,
            command.phoneNumber,
            command.dateOfBirth,
            command.gender,
            command.position,
            command.department,
            command.hireDate,
            true, // isActive
            new Date(), // createdAt
            new Date() // updatedAt
        );

        const createdEmployee = await this.employeeRepository.createAsync(employee);

        this.logger.info('CreateEmployeeCommandHandler-handle: Employee created successfully', {
            employeeId: createdEmployee.id,
        });

        return EmployeeMapper.toDto(createdEmployee);
    }
}
