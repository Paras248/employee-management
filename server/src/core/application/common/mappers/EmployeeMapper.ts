import { Employee } from '@@domain/entities/Employee';
import { EmployeeDto } from '../dtos/EmployeeDto';

export class EmployeeMapper {
    static toDto(employee: Employee): EmployeeDto {
        return new EmployeeDto(
            employee.id,
            employee.name,
            employee.email,
            employee.address,
            employee.phoneNumber,
            employee.dateOfBirth,
            employee.gender,
            employee.position,
            employee.department,
            employee.hireDate,
            employee.isActive,
            employee.createdAt,
            employee.updatedAt
        );
    }

    static toDtoList(employees: Employee[]): EmployeeDto[] {
        return employees.map((employee) => this.toDto(employee));
    }
}
