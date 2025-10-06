import { SearchEmployeesQueryHandler } from '@@application/features/employee/queries/searchEmployees/SearchEmployeesQueryHandler';
import { SearchEmployeesQuery } from '@@application/features/employee/queries/searchEmployees/SearchEmployeesQuery';
import { mockEmployees, mockEmployeeRepository, mockLogger } from '../../../../../utils/testMocks';

describe('SearchEmployeesQueryHandler', () => {
    let handler: SearchEmployeesQueryHandler;

    beforeEach(() => {
        handler = new SearchEmployeesQueryHandler(mockEmployeeRepository, mockLogger);
        jest.clearAllMocks();
    });

    describe('handle', () => {
        const validQuery = new SearchEmployeesQuery('john');

        it('should return matching employees as DTOs when search results exist', async () => {
            // Arrange
            const searchResults = [mockEmployees[0]]; // Only John Doe
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue(searchResults);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith(
                'SearchEmployeesQueryHandler-handle: Inside Handler',
                {
                    searchTerm: 'john',
                }
            );
            expect(mockEmployeeRepository.searchByNameAsync).toHaveBeenCalledWith('john');
            expect(mockLogger.info).toHaveBeenCalledWith(
                'SearchEmployeesQueryHandler-handle: Employee search completed',
                {
                    searchTerm: 'john',
                    resultsCount: 1,
                }
            );
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('John Doe');
        });

        it('should return empty array when no matching employees found', async () => {
            // Arrange
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue([]);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith(
                'SearchEmployeesQueryHandler-handle: Inside Handler',
                {
                    searchTerm: 'john',
                }
            );
            expect(mockEmployeeRepository.searchByNameAsync).toHaveBeenCalledWith('john');
            expect(mockLogger.info).toHaveBeenCalledWith(
                'SearchEmployeesQueryHandler-handle: Employee search completed',
                {
                    searchTerm: 'john',
                    resultsCount: 0,
                }
            );
            expect(result).toHaveLength(0);
        });

        it('should handle case-insensitive search', async () => {
            // Arrange
            const searchQuery = new SearchEmployeesQuery('JOHN');
            const searchResults = [mockEmployees[0]];
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue(searchResults);

            // Act
            const result = await handler.handle(searchQuery);

            // Assert
            expect(mockEmployeeRepository.searchByNameAsync).toHaveBeenCalledWith('JOHN');
            expect(result).toHaveLength(1);
        });

        it('should handle partial name matches', async () => {
            // Arrange
            const searchQuery = new SearchEmployeesQuery('doe');
            const searchResults = [mockEmployees[0]];
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue(searchResults);

            // Act
            const result = await handler.handle(searchQuery);

            // Assert
            expect(mockEmployeeRepository.searchByNameAsync).toHaveBeenCalledWith('doe');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('John Doe');
        });

        it('should log appropriate messages during search', async () => {
            // Arrange
            const searchResults = [mockEmployees[0]];
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue(searchResults);

            // Act
            await handler.handle(validQuery);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledTimes(2);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'SearchEmployeesQueryHandler-handle: Inside Handler',
                {
                    searchTerm: 'john',
                }
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                'SearchEmployeesQueryHandler-handle: Employee search completed',
                {
                    searchTerm: 'john',
                    resultsCount: 1,
                }
            );
        });

        it('should handle repository errors gracefully', async () => {
            // Arrange
            const repositoryError = new Error('Database connection failed');
            mockEmployeeRepository.searchByNameAsync.mockRejectedValue(repositoryError);

            // Act & Assert
            await expect(handler.handle(validQuery)).rejects.toThrow('Database connection failed');
        });

        it('should return properly mapped DTOs', async () => {
            // Arrange
            const searchResults = [mockEmployees[0]];
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue(searchResults);

            // Act
            const result = await handler.handle(validQuery);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
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

        it('should handle multiple search results', async () => {
            // Arrange
            const searchQuery = new SearchEmployeesQuery('e'); // Should match both John and Jane
            mockEmployeeRepository.searchByNameAsync.mockResolvedValue(mockEmployees);

            // Act
            const result = await handler.handle(searchQuery);

            // Assert
            expect(mockEmployeeRepository.searchByNameAsync).toHaveBeenCalledWith('e');
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('John Doe');
            expect(result[1].name).toBe('Jane Smith');
        });
    });
});
