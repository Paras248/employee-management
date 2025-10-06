import { Employee } from '@@domain/entities/Employee';
import { EmployeeDto } from '../dtos/EmployeeDto';

export class EmployeeMapper {
    static toDto(employee: Employee): EmployeeDto {
        const toIso = (d: any) => (d instanceof Date ? d.toISOString() : new Date(d).toISOString());
        return new EmployeeDto(
            employee.id,
            employee.name,
            employee.email,
            employee.address,
            employee.phoneNumber,
            toIso(employee.dateOfBirth),
            employee.gender,
            employee.position,
            employee.department,
            toIso(employee.hireDate),
            Boolean(employee.isActive),
            toIso(employee.createdAt),
            toIso(employee.updatedAt)
        );
    }

    static toDtoList(employees: Employee[]): EmployeeDto[] {
        return employees.map((employee) => this.toDto(employee));
    }
}
