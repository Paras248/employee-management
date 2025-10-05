import { IEmployeeRepository } from "@@domain/contracts/repositories/EmployeeRepository";
import { Employee } from "@@domain/entities/Employee";
import { inject } from "tsyringe";
import { DbConnectionService } from "../services/DbConnectionService";

export class EmployeeRepository implements IEmployeeRepository {
    constructor(
        @inject("DbConnectionService")
        private readonly _db: DbConnectionService
    ) {}

    async findByIdAsync(id: number): Promise<Employee | null> {
        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive FROM employees WHERE id = ?`;

        const result = await this._db.get(query, [id]);

        if (!result) {
            return null;
        }

        return new Employee(
            result.id,
            result.email,
            result.name,
            result.address,
            result.phoneNumber,
            result.dateOfBirth,
            result.gender,
            result.position,
            result.department,
            result.hireDate,
            result.isActive
        );
    }

    async deleteByIdAsync(id: number): Promise<void> {
        const query = `DELETE FROM employees WHERE id = ?`;
        await this._db.run(query, [id]);
    }

    async findByEmailAsync(email: string): Promise<Employee | null> {
        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive FROM employees WHERE email = ?`;

        const result = await this._db.get(query, [email]);

        if (!result) {
            return null;
        }

        return new Employee(
            result.id,
            result.email,
            result.name,
            result.address,
            result.phoneNumber,
            result.dateOfBirth,
            result.gender,
            result.position,
            result.department,
            result.hireDate,
            result.isActive
        );
    }

    async findAllAsync(): Promise<Employee[]> {
        const query = `SELECT id, email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive FROM employees`;

        const result = await this._db.all(query);

        return result.map(
            (result) =>
                new Employee(
                    result.id,
                    result.email,
                    result.name,
                    result.address,
                    result.phoneNumber,
                    result.dateOfBirth,
                    result.gender,
                    result.position,
                    result.department,
                    result.hireDate,
                    result.isActive
                )
        );
    }

    async createAsync(employee: Employee): Promise<Employee> {
        const query = `INSERT INTO employees 
            (email, name, address, phoneNumber, dateOfBirth, gender, position, department, hireDate, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await this._db.run(query, [
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
        ]);

        const lastId = await this._db.lastId();

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
        const query = `UPDATE employees SET email = ?, name = ?, address = ?, phoneNumber = ?, dateOfBirth = ?, gender = ?, position = ?, department = ?, hireDate = ?, isActive = ? WHERE id = ?`;

        await this._db.run(query, [
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
            employee.id,
        ]);
    }
}
