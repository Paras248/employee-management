import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { Employee } from '@@domain/entities/Employee';
import { GetAllEmployeesQuery } from './GetAllEmployeesQuery';
import { ILogger } from '@@domain/contracts/external-services/ILogger';
import { EmployeeDto } from '@@application/common/dtos/EmployeeDto';
import { EmployeeMapper } from '@@application/common/mappers/EmployeeMapper';

@injectable()
export class GetAllEmployeesQueryHandler {
    constructor(
        @inject('IEmployeeRepository')
        private employeeRepository: IEmployeeRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async handle(query: GetAllEmployeesQuery): Promise<EmployeeDto[]> {
        this.logger.info('GetAllEmployeesQueryHandler-handle: Inside Handler');

        const employees = await this.employeeRepository.findAllAsync();

        this.logger.info(
            'GetAllEmployeesQueryHandler-handle: All employees retrieved successfully',
            {
                count: employees.length,
            }
        );

        return EmployeeMapper.toDtoList(employees);
    }
}
