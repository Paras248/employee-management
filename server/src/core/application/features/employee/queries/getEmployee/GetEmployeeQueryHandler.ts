import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { Employee } from '@@domain/entities/Employee';
import { GetEmployeeQuery } from './GetEmployeeQuery';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { ILogger } from '@@domain/contracts/external-services/ILogger';
import { EmployeeDto } from '@@application/common/dtos/EmployeeDto';
import { EmployeeMapper } from '@@application/common/mappers/EmployeeMapper';

@injectable()
export class GetEmployeeQueryHandler {
    constructor(
        @inject('IEmployeeRepository')
        private employeeRepository: IEmployeeRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async handle(query: GetEmployeeQuery): Promise<EmployeeDto> {
        this.logger.info('GetEmployeeQueryHandler-handle: Inside Handler', {
            employeeId: query.id,
        });

        const employee = await this.employeeRepository.findByIdAsync(query.id);

        if (!employee) {
            throw new NotFoundException(`Employee with ID ${query.id} not found`);
        }

        this.logger.info('GetEmployeeQueryHandler-handle: Employee retrieved successfully', {
            employeeId: query.id,
        });

        return EmployeeMapper.toDto(employee);
    }
}
