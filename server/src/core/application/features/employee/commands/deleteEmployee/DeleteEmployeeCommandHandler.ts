import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { DeleteEmployeeCommand } from './DeleteEmployeeCommand';
import { DeleteEmployeeValidator } from './DeleteEmployeeValidator';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { ILogger } from '@@domain/contracts/external-services/ILogger';

@injectable()
export class DeleteEmployeeCommandHandler {
    constructor(
        @inject('IEmployeeRepository')
        private employeeRepository: IEmployeeRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async handle(command: DeleteEmployeeCommand): Promise<void> {
        this.logger.info('DeleteEmployeeCommandHandler-handle: Inside Handler', {
            employeeId: command.id,
        });

        // Validate the command
        const validation = DeleteEmployeeValidator.validate(command);

        if (!validation.isValid) {
            throw new ValidationException('Invalid employee ID', validation.errors);
        }

        // Check if employee exists
        const existingEmployee = await this.employeeRepository.findByIdAsync(command.id);
        if (!existingEmployee) {
            throw new NotFoundException(`Employee with ID ${command.id} not found`);
        }

        // Delete employee
        await this.employeeRepository.deleteByIdAsync(command.id);

        this.logger.info('DeleteEmployeeCommandHandler-handle: Employee deleted successfully', {
            employeeId: command.id,
        });
    }
}
