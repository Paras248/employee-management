import { Employee } from '@@domain/entities/Employee';
import { IEmployeeRepository } from '@@domain/contracts/repositories/EmployeeRepository';
import { ILogger } from '@@domain/contracts/external-services/ILogger';

export const mockEmployee: Employee = new Employee(
    1,
    'john@example.com',
    'John Doe',
    '123 Main St',
    '+1234567890',
    new Date('1990-01-01'),
    'Male',
    'Developer',
    'Engineering',
    new Date('2020-01-01'),
    true,
    new Date('2020-01-01'),
    new Date('2020-01-01')
);

export const mockEmployees: Employee[] = [
    mockEmployee,
    new Employee(
        2,
        'jane@example.com',
        'Jane Smith',
        '456 Oak Ave',
        '+1234567891',
        new Date('1992-05-15'),
        'Female',
        'Designer',
        'Design',
        new Date('2021-03-15'),
        true,
        new Date('2021-03-15'),
        new Date('2021-03-15')
    ),
];

export const mockEmployeeRepository: jest.Mocked<IEmployeeRepository> = {
    findByIdAsync: jest.fn(),
    findByEmailAsync: jest.fn(),
    findAllAsync: jest.fn(),
    searchByNameAsync: jest.fn(),
    createAsync: jest.fn(),
    updateAsync: jest.fn(),
    deleteByIdAsync: jest.fn(),
};

export const mockLogger: jest.Mocked<ILogger> = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
