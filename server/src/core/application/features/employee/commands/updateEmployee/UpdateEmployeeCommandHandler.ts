import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { Employee } from '@@domain/entities/Employee';
import { UpdateEmployeeCommand } from './UpdateEmployeeCommand';
import { UpdateEmployeeValidator } from './UpdateEmployeeValidator';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { ILogger } from '@@domain/contracts/external-services/ILogger';
import { EmployeeDto } from '@@application/common/dtos/EmployeeDto';
import { EmployeeMapper } from '@@application/common/mappers/EmployeeMapper';

@injectable()
export class UpdateEmployeeCommandHandler {
    constructor(
        @inject('IEmployeeRepository')
        private employeeRepository: IEmployeeRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async handle(command: UpdateEmployeeCommand): Promise<EmployeeDto> {
        this.logger.info('UpdateEmployeeCommandHandler-handle: Inside Handler', {
            employeeId: command.id,
        });

        // Validate the command
        const validation = UpdateEmployeeValidator.validate(command);

        if (!validation.isValid) {
            throw new ValidationException('Invalid employee data', validation.errors);
        }

        // Check if employee exists
        const existingEmployee = await this.employeeRepository.findByIdAsync(command.id);
        if (!existingEmployee) {
            throw new NotFoundException(`Employee with ID ${command.id} not found`);
        }

        // Check if email is being changed and if new email already exists
        if (existingEmployee.email !== command.email) {
            const employeeWithEmail = await this.employeeRepository.findByEmailAsync(command.email);

            if (employeeWithEmail && employeeWithEmail.id !== command.id) {
                throw new ValidationException('Email already exists for another employee', [
                    'Email must be unique',
                ]);
            }
        }

        // Update employee
        const updatedEmployee = new Employee(
            command.id,
            command.email,
            command.name,
            command.address,
            command.phoneNumber,
            command.dateOfBirth,
            command.gender,
            command.position,
            command.department,
            command.hireDate,
            existingEmployee.isActive,
            existingEmployee.createdAt,
            new Date() // updatedAt
        );

        await this.employeeRepository.updateAsync(updatedEmployee);

        this.logger.info('UpdateEmployeeCommandHandler-handle: Employee updated successfully', {
            employeeId: command.id,
        });

        return EmployeeMapper.toDto(updatedEmployee);
    }
}
