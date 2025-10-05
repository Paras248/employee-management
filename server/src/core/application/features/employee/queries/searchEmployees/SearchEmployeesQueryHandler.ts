import { inject, injectable } from 'tsyringe';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { SearchEmployeesQuery } from './SearchEmployeesQuery';
import { ILogger } from '@@domain/contracts/external-services/ILogger';
import { EmployeeDto } from '@@application/common/dtos/EmployeeDto';
import { EmployeeMapper } from '@@application/common/mappers/EmployeeMapper';

@injectable()
export class SearchEmployeesQueryHandler {
    constructor(
        @inject('IEmployeeRepository')
        private employeeRepository: IEmployeeRepository,
        @inject('ILogger') private logger: ILogger
    ) {}

    async handle(query: SearchEmployeesQuery): Promise<EmployeeDto[]> {
        this.logger.info('SearchEmployeesQueryHandler-handle: Inside Handler', {
            searchTerm: query.searchTerm,
        });

        const employees = await this.employeeRepository.searchByNameAsync(query.searchTerm);

        this.logger.info('SearchEmployeesQueryHandler-handle: Employee search completed', {
            searchTerm: query.searchTerm,
            resultsCount: employees.length,
        });

        return EmployeeMapper.toDtoList(employees);
    }
}
