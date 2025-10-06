import { GetEmployeeQueryHandler } from '@@application/features/employee/queries/getEmployee/GetEmployeeQueryHandler';
import { GetEmployeeQuery } from '@@application/features/employee/queries/getEmployee/GetEmployeeQuery';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { mockEmployee, mockEmployeeRepository, mockLogger } from '../../../../../utils/testMocks';

describe('GetEmployeeQueryHandler', () => {
    let handler: GetEmployeeQueryHandler;

    beforeEach(() => {
        handler = new GetEmployeeQueryHandler(mockEmployeeRepository, mockLogger);
        jest.clearAllMocks();
    });

    describe('handle', () => {
        const validQuery = new GetEmployeeQuery(1);

        it('should return employee DTO when employee exists', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(mockEmployee);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith(
                'GetEmployeeQueryHandler-handle: Inside Handler',
                {
                    employeeId: 1,
                }
            );
            expect(mockEmployeeRepository.findByIdAsync).toHaveBeenCalledWith(1);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'GetEmployeeQueryHandler-handle: Employee retrieved successfully',
                {
                    employeeId: 1,
                }
            );
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.name).toBe('John Doe');
            expect(result.email).toBe('john@example.com');
        });

        it('should throw NotFoundException when employee does not exist', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(null);

            // Act & Assert
            await expect(handler.handle(validQuery)).rejects.toThrow(NotFoundException);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'GetEmployeeQueryHandler-handle: Inside Handler',
                {
                    employeeId: 1,
                }
            );
        });

        it('should log appropriate messages during successful retrieval', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(mockEmployee);

            // Act
            await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledTimes(2);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'GetEmployeeQueryHandler-handle: Inside Handler',
                {
                    employeeId: 1,
                }
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                'GetEmployeeQueryHandler-handle: Employee retrieved successfully',
                {
                    employeeId: 1,
                }
            );
        });

        it('should handle repository errors gracefully', async () => {
            // Arrange
            const repositoryError = new Error('Database connection failed');
            mockEmployeeRepository.findByIdAsync.mockRejectedValue(repositoryError);

            // Act & Assert
            await expect(handler.handle(validQuery)).rejects.toThrow('Database connection failed');
        });

        it('should return properly mapped DTO', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(mockEmployee);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(result).toEqual({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Main St',
                phoneNumber: '+1234567890',
                dateOfBirth: '1990-01-01T00:00:00.000Z',
                gender: 'Male',
                position: 'Developer',
                department: 'Engineering',
                hireDate: '2020-01-01T00:00:00.000Z',
                isActive: true,
                createdAt: '2020-01-01T00:00:00.000Z',
                updatedAt: '2020-01-01T00:00:00.000Z',
            });
        });
    });
});
