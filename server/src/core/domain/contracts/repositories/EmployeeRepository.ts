import { Employee } from "@@domain/entities/Employee";

export interface IEmployeeRepository {
    findByEmail(email: string): Promise<Employee | null>;
    findAll(): Promise<Employee[]>;
    deleteByEmail(email: string): Promise<Employee>;
    create(employee: Employee): Promise<Employee>;
    update(employee: Employee): Promise<Employee>;
}
