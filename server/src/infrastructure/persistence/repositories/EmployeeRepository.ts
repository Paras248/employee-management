import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { Employee } from '@@domain/entities/Employee';
import { inject, injectable } from 'tsyringe';
import { DbConnectionService } from '../services/DbConnectionService';
import { ILogger } from '@@domain/contracts/external-services/ILogger';

@injectable()
export class EmployeeRepository implements IEmployeeRepository {
    constructor(
        @inject('DbConnectionService')
        private readonly _db: DbConnectionService,
        @inject('ILogger') private logger: ILogger
    ) {}

    private parseDbDate(value: any): Date {
        if (value === null || value === undefined) return new Date(NaN);
        if (typeof value === 'number') return new Date(value);
        if (typeof value === 'string') {
            const numeric = Number(value);
            if (!Number.isNaN(numeric)) return new Date(numeric);
            return new Date(value);
        }
        return new Date(value);
    }

    private formatDbDate(value: any): string {
        const dt = this.parseDbDate(value);
        return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
    }

    async findByIdAsync(id: number): Promise<Employee | null> {
        this.logger.info('EmployeeRepository-findByIdAsync: Inside Handler', {
            id,
        });

        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive FROM employees WHERE id = ?`;

        const result = await this._db.get(query, [id]);

        if (!result) {
            this.logger.info('EmployeeRepository-findByIdAsync: Employee not found', { id });
            return null;
        }

        this.logger.info('EmployeeRepository-findByIdAsync: Employee found', {
            id,
        });
        return new Employee(
            result.id,
            result.email,
            result.name,
            result.address,
            result.phoneNumber,
            this.parseDbDate(result.dateOfBirth),
            result.gender,
            result.position,
            result.department,
            this.parseDbDate(result.hireDate),
            typeof result.isActive === 'number' ? result.isActive === 1 : Boolean(result.isActive)
        );
    }

    async deleteByIdAsync(id: number): Promise<void> {
        this.logger.info('EmployeeRepository-deleteByIdAsync: Inside Handler', {
            id,
        });

        const query = `DELETE FROM employees WHERE id = ?`;
        await this._db.run(query, [id]);

        this.logger.info('EmployeeRepository-deleteByIdAsync: Employee deleted successfully', {
            id,
        });
    }

    async findByEmailAsync(email: string): Promise<Employee | null> {
        this.logger.info('EmployeeRepository-findByEmailAsync: Inside Handler', { email });

        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive FROM employees WHERE email = ?`;

        const result = await this._db.get(query, [email]);

        if (!result) {
            this.logger.info('EmployeeRepository-findByEmailAsync: Employee not found', { email });
            return null;
        }

        this.logger.info('EmployeeRepository-findByEmailAsync: Employee found', { email });
        return new Employee(
            result.id,
            result.email,
            result.name,
            result.address,
            result.phoneNumber,
            this.parseDbDate(result.dateOfBirth),
            result.gender,
            result.position,
            result.department,
            this.parseDbDate(result.hireDate),
            typeof result.isActive === 'number' ? result.isActive === 1 : Boolean(result.isActive)
        );
    }

    async findAllAsync(): Promise<Employee[]> {
        this.logger.info('EmployeeRepository-findAllAsync: Inside Handler');

        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive FROM employees`;

        const result = await this._db.all(query);

        this.logger.info('EmployeeRepository-findAllAsync: Employees retrieved successfully', {
            count: result.length,
        });
        return result.map(
            (result) =>
                new Employee(
                    result.id,
                    result.email,
                    result.name,
                    result.address,
                    result.phoneNumber,
                    this.parseDbDate(result.dateOfBirth),
                    result.gender,
                    result.position,
                    result.department,
                    this.parseDbDate(result.hireDate),
                    typeof result.isActive === 'number'
                        ? result.isActive === 1
                        : Boolean(result.isActive)
                )
        );
    }

    async searchByNameAsync(searchTerm: string): Promise<Employee[]> {
        this.logger.info('EmployeeRepository-searchByNameAsync: Inside Handler', { searchTerm });

        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive 
                      FROM employees 
                      WHERE name LIKE ?`;

        const result = await this._db.all(query, [`%${searchTerm}%`]);

        this.logger.info('EmployeeRepository-searchByNameAsync: Search completed successfully', {
            searchTerm,
            count: result.length,
        });
        return result.map(
            (result) =>
                new Employee(
                    result.id,
                    result.email,
                    result.name,
                    result.address,
                    result.phoneNumber,
                    this.parseDbDate(result.dateOfBirth),
                    result.gender,
                    result.position,
                    result.department,
                    this.parseDbDate(result.hireDate),
                    typeof result.isActive === 'number'
                        ? result.isActive === 1
                        : Boolean(result.isActive)
                )
        );
    }

    async createAsync(employee: Employee): Promise<Employee> {
        this.logger.info('EmployeeRepository-createAsync: Inside Handler', {
            email: employee.email,
            name: employee.name,
        });

        const query = `INSERT INTO employees 
            (email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await this._db.run(query, [
            employee.email,
            employee.name,
            employee.address,
            employee.phoneNumber,
            this.formatDbDate(employee.dateOfBirth),
            employee.gender,
            employee.position,
            employee.department,
            this.formatDbDate(employee.hireDate),
            employee.isActive ? 1 : 0,
        ]);

        const lastId = await this._db.lastId();

        this.logger.info('EmployeeRepository-createAsync: Employee created successfully', {
            id: lastId,
            email: employee.email,
        });

        return new Employee(
            lastId,
            employee.email,
            employee.name,
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

    async updateAsync(employee: Employee): Promise<void> {
        this.logger.info('EmployeeRepository-updateAsync: Inside Handler', {
            id: employee.id,
            email: employee.email,
        });

        const query = `UPDATE employees SET email = ?, name = ?, address = ?, phoneNumber = ?, dateOfBirth = ?, gender = ?, position = ?, department = ?, hireDate = ?, isActive = ? WHERE id = ?`;

        await this._db.run(query, [
            employee.email,
            employee.name,
            employee.address,
            employee.phoneNumber,
            this.formatDbDate(employee.dateOfBirth),
            employee.gender,
            employee.position,
            employee.department,
            this.formatDbDate(employee.hireDate),
            employee.isActive ? 1 : 0,
            employee.id,
        ]);

        this.logger.info('EmployeeRepository-updateAsync: Employee updated successfully', {
            id: employee.id,
        });
    }
}
