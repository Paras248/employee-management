import { GetAllEmployeesQueryHandler } from '@@application/features/employee/queries/getAllEmployees/GetAllEmployeesQueryHandler';
import { GetAllEmployeesQuery } from '@@application/features/employee/queries/getAllEmployees/GetAllEmployeesQuery';
import { mockEmployees, mockEmployeeRepository, mockLogger } from '../../../../../utils/testMocks';

describe('GetAllEmployeesQueryHandler', () => {
    let handler: GetAllEmployeesQueryHandler;

    beforeEach(() => {
        handler = new GetAllEmployeesQueryHandler(mockEmployeeRepository, mockLogger);
        jest.clearAllMocks();
    });

    describe('handle', () => {
        const validQuery = new GetAllEmployeesQuery();

        it('should return all employees as DTOs when employees exist', async () => {
            // Arrange
            mockEmployeeRepository.findAllAsync.mockResolvedValue(mockEmployees);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Getting all employees');
            expect(mockEmployeeRepository.findAllAsync).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('All employees retrieved successfully', {
                count: 2,
            });
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(2);
        });

        it('should return empty array when no employees exist', async () => {
            // Arrange
            mockEmployeeRepository.findAllAsync.mockResolvedValue([]);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Getting all employees');
            expect(mockEmployeeRepository.findAllAsync).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith('All employees retrieved successfully', {
                count: 0,
            });
            expect(result).toHaveLength(0);
        });

        it('should log appropriate messages during successful retrieval', async () => {
            // Arrange
            mockEmployeeRepository.findAllAsync.mockResolvedValue(mockEmployees);

            // Act
            await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledTimes(2);
            expect(mockLogger.info).toHaveBeenCalledWith('Getting all employees');
            expect(mockLogger.info).toHaveBeenCalledWith('All employees retrieved successfully', {
                count: 2,
            });
        });

        it('should handle repository errors gracefully', async () => {
            // Arrange
            const repositoryError = new Error('Database connection failed');
            mockEmployeeRepository.findAllAsync.mockRejectedValue(repositoryError);

            // Act & Assert
            await expect(handler.handle(validQuery)).rejects.toThrow('Database connection failed');
        });

        it('should return properly mapped DTOs', async () => {
            // Arrange
            mockEmployeeRepository.findAllAsync.mockResolvedValue(mockEmployees);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                address: '123 Main St',
                phoneNumber: '+1234567890',
                dateOfBirth: new Date('1990-01-01'),
                gender: 'Male',
                position: 'Developer',
                department: 'Engineering',
                hireDate: new Date('2020-01-01'),
                isActive: true,
                createdAt: new Date('2020-01-01'),
                updatedAt: new Date('2020-01-01'),
            });
            expect(result[1]).toEqual({
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                address: '456 Oak Ave',
                phoneNumber: '+1234567891',
                dateOfBirth: new Date('1992-05-15'),
                gender: 'Female',
                position: 'Designer',
                department: 'Design',
                hireDate: new Date('2021-03-15'),
                isActive: true,
                createdAt: new Date('2021-03-15'),
                updatedAt: new Date('2021-03-15'),
            });
        });
    });
});
