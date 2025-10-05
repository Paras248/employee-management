import { DeleteEmployeeCommandHandler } from '@@application/features/employee/commands/deleteEmployee/DeleteEmployeeCommandHandler';
import { DeleteEmployeeCommand } from '@@application/features/employee/commands/deleteEmployee/DeleteEmployeeCommand';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { mockEmployee, mockEmployeeRepository, mockLogger } from '../../../../../utils/testMocks';

describe('DeleteEmployeeCommandHandler', () => {
    let handler: DeleteEmployeeCommandHandler;

    beforeEach(() => {
        handler = new DeleteEmployeeCommandHandler(mockEmployeeRepository, mockLogger);
        jest.clearAllMocks();
    });

    describe('handle', () => {
        const validCommand = new DeleteEmployeeCommand(1);

        it('should delete employee successfully when employee exists', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(mockEmployee);
            mockEmployeeRepository.deleteByIdAsync.mockResolvedValue();

            // Act
            await handler.handle(validCommand);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('Deleting employee', {
                employeeId: 1,
            });
            expect(mockEmployeeRepository.findByIdAsync).toHaveBeenCalledWith(1);
            expect(mockEmployeeRepository.deleteByIdAsync).toHaveBeenCalledWith(1);
            expect(mockLogger.info).toHaveBeenCalledWith('Employee deleted successfully', {
                employeeId: 1,
            });
        });

        it('should throw NotFoundException when employee does not exist', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(null);

            // Act & Assert
            await expect(handler.handle(validCommand)).rejects.toThrow(NotFoundException);
            expect(mockEmployeeRepository.deleteByIdAsync).not.toHaveBeenCalled();
        });

        it('should throw ValidationException when command validation fails', async () => {
            // Arrange
            const invalidCommand = new DeleteEmployeeCommand(0); // Invalid: non-positive ID

            // Act & Assert
            await expect(handler.handle(invalidCommand)).rejects.toThrow(ValidationException);
            expect(mockEmployeeRepository.findByIdAsync).not.toHaveBeenCalled();
            expect(mockEmployeeRepository.deleteByIdAsync).not.toHaveBeenCalled();
        });

        it('should log appropriate messages during successful deletion', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(mockEmployee);
            mockEmployeeRepository.deleteByIdAsync.mockResolvedValue();

            // Act
            await handler.handle(validCommand);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledTimes(2);
            expect(mockLogger.info).toHaveBeenCalledWith('Deleting employee', {
                employeeId: 1,
            });
            expect(mockLogger.info).toHaveBeenCalledWith('Employee deleted successfully', {
                employeeId: 1,
            });
        });

        it('should handle repository errors gracefully', async () => {
            // Arrange
            const repositoryError = new Error('Database connection failed');
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(mockEmployee);
            mockEmployeeRepository.deleteByIdAsync.mockRejectedValue(repositoryError);

            // Act & Assert
            await expect(handler.handle(validCommand)).rejects.toThrow(
                'Database connection failed'
            );
        });
    });
});
