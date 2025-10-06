import { CreateEmployeeCommandHandler } from '@@application/features/employee/commands/createEmployee/CreateEmployeeCommandHandler';
import { CreateEmployeeCommand } from '@@application/features/employee/commands/createEmployee/CreateEmployeeCommand';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { mockEmployee, mockEmployeeRepository, mockLogger } from '../../../../../utils/testMocks';

describe('CreateEmployeeCommandHandler', () => {
    let handler: CreateEmployeeCommandHandler;

    beforeEach(() => {
        handler = new CreateEmployeeCommandHandler(mockEmployeeRepository, mockLogger);
        jest.clearAllMocks();
    });

    describe('handle', () => {
        const validCommand = new CreateEmployeeCommand(
            'John Doe',
            'john@example.com',
            '123 Main St',
            '+1234567890',
            new Date('1990-01-01'),
            'Male',
            'Developer',
            'Engineering',
            new Date('2020-01-01')
        );

        it('should create employee successfully when all data is valid', async () => {
            // Arrange
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(null);
            mockEmployeeRepository.createAsync.mockResolvedValue(mockEmployee);

            // Act
            const result = await handler.handle(validCommand);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith(
                'CreateEmployeeCommandHandler-handle: Inside Handler',
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                }
            );
            expect(mockEmployeeRepository.findByEmailAsync).toHaveBeenCalledWith(
                'john@example.com'
            );
            expect(mockEmployeeRepository.createAsync).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith(
                'CreateEmployeeCommandHandler-handle: Employee created successfully',
                {
                    employeeId: 1,
                }
            );
            expect(result).toBeDefined();
        });

        it('should throw ValidationException when email already exists', async () => {
            // Arrange
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(mockEmployee);

            // Act & Assert
            await expect(handler.handle(validCommand)).rejects.toThrow(ValidationException);
            expect(mockEmployeeRepository.createAsync).not.toHaveBeenCalled();
        });

        it('should throw ValidationException when command validation fails', async () => {
            // Arrange
            const invalidCommand = new CreateEmployeeCommand(
                '', // Invalid: empty name
                'invalid-email', // Invalid: malformed email
                '', // Invalid: empty address
                '123', // Invalid: short phone number
                new Date('2030-01-01'), // Invalid: future date
                'Invalid', // Invalid: not in enum
                '', // Invalid: empty position
                '', // Invalid: empty department
                new Date('2030-01-01') // Invalid: future date
            );

            // Act & Assert
            await expect(handler.handle(invalidCommand)).rejects.toThrow(ValidationException);
            expect(mockEmployeeRepository.findByEmailAsync).not.toHaveBeenCalled();
            expect(mockEmployeeRepository.createAsync).not.toHaveBeenCalled();
        });

        it('should log appropriate messages during successful creation', async () => {
            // Arrange
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(null);
            mockEmployeeRepository.createAsync.mockResolvedValue(mockEmployee);

            // Act
            await handler.handle(validCommand);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledTimes(2);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'CreateEmployeeCommandHandler-handle: Inside Handler',
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                }
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                'CreateEmployeeCommandHandler-handle: Employee created successfully',
                {
                    employeeId: 1,
                }
            );
        });
    });
});
