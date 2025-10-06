import { UpdateEmployeeCommandHandler } from '@@application/features/employee/commands/updateEmployee/UpdateEmployeeCommandHandler';
import { UpdateEmployeeCommand } from '@@application/features/employee/commands/updateEmployee/UpdateEmployeeCommand';
import { ValidationException } from '@@domain/exceptions/ValidationException';
import { NotFoundException } from '@@domain/exceptions/NotFoundException';
import { mockEmployee, mockEmployeeRepository, mockLogger } from '../../../../../utils/testMocks';

describe('UpdateEmployeeCommandHandler', () => {
    let handler: UpdateEmployeeCommandHandler;

    beforeEach(() => {
        handler = new UpdateEmployeeCommandHandler(mockEmployeeRepository, mockLogger);
        jest.clearAllMocks();
    });

    describe('handle', () => {
        const validCommand = new UpdateEmployeeCommand(
            1,
            'John Updated',
            'john.updated@example.com',
            '456 Updated St',
            '+1234567890',
            new Date('1990-01-01'),
            'Male',
            'Senior Developer',
            'Engineering',
            new Date('2020-01-01'),
            false
        );

        it('should update employee successfully when all data is valid', async () => {
            // Arrange
            const existingEmployee = mockEmployee;
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(existingEmployee);
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(null);
            mockEmployeeRepository.updateAsync.mockResolvedValue();

            // Act
            const result = await handler.handle(validCommand);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith(
                'UpdateEmployeeCommandHandler-handle: Inside Handler',
                {
                    employeeId: 1,
                }
            );
            expect(mockEmployeeRepository.findByIdAsync).toHaveBeenCalledWith(1);
            expect(mockEmployeeRepository.updateAsync).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith(
                'UpdateEmployeeCommandHandler-handle: Employee updated successfully',
                {
                    employeeId: 1,
                }
            );
            expect(result).toBeDefined();
        });

        it('should throw NotFoundException when employee does not exist', async () => {
            // Arrange
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(null);

            // Act & Assert
            await expect(handler.handle(validCommand)).rejects.toThrow(NotFoundException);
            expect(mockEmployeeRepository.updateAsync).not.toHaveBeenCalled();
        });

        it('should throw ValidationException when email already exists for another employee', async () => {
            // Arrange
            const existingEmployee = mockEmployee;
            const anotherEmployee = { ...mockEmployee, id: 2 };
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(existingEmployee);
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(anotherEmployee);

            // Act & Assert
            await expect(handler.handle(validCommand)).rejects.toThrow(ValidationException);
            expect(mockEmployeeRepository.updateAsync).not.toHaveBeenCalled();
        });

        it('should allow same email for the same employee', async () => {
            // Arrange
            const existingEmployee = mockEmployee;
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(existingEmployee);
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(existingEmployee);
            mockEmployeeRepository.updateAsync.mockResolvedValue();

            // Act
            const result = await handler.handle(validCommand);

            // Assert
            expect(mockEmployeeRepository.updateAsync).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        it('should throw ValidationException when command validation fails', async () => {
            // Arrange
            const invalidCommand = new UpdateEmployeeCommand(
                0, // Invalid: non-positive ID
                '', // Invalid: empty name
                'invalid-email', // Invalid: malformed email
                '', // Invalid: empty address
                '123', // Invalid: short phone number
                new Date('2030-01-01'), // Invalid: future date
                'Invalid', // Invalid: not in enum
                '', // Invalid: empty position
                '', // Invalid: empty department
                new Date('2030-01-01'), // Invalid: future date
                null as unknown as boolean // Invalid: missing boolean
            );

            // Act & Assert
            await expect(handler.handle(invalidCommand)).rejects.toThrow(ValidationException);
            expect(mockEmployeeRepository.findByIdAsync).not.toHaveBeenCalled();
            expect(mockEmployeeRepository.updateAsync).not.toHaveBeenCalled();
        });

        it('should log appropriate messages during successful update', async () => {
            // Arrange
            const existingEmployee = mockEmployee;
            mockEmployeeRepository.findByIdAsync.mockResolvedValue(existingEmployee);
            mockEmployeeRepository.findByEmailAsync.mockResolvedValue(null);
            mockEmployeeRepository.updateAsync.mockResolvedValue();

            // Act
            await handler.handle(validCommand);

            // Assert
            expect(mockLogger.info).toHaveBeenCalledTimes(2);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'UpdateEmployeeCommandHandler-handle: Inside Handler',
                {
                    employeeId: 1,
                }
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                'UpdateEmployeeCommandHandler-handle: Employee updated successfully',
                {
                    employeeId: 1,
                }
            );
        });
    });
});
