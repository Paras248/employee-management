import { Employee } from '@@domain/entities/Employee';

export interface IEmployeeRepository {
    findByIdAsync(id: number): Promise<Employee | null>;
    findByEmailAsync(email: string): Promise<Employee | null>;
    findAllAsync(): Promise<Employee[]>;
    searchByNameAsync(searchTerm: string): Promise<Employee[]>;
    createAsync(employee: Employee): Promise<Employee>;
    updateAsync(employee: Employee): Promise<void>;
    deleteByIdAsync(id: number): Promise<void>;
}
