import Joi from 'joi';
import { DeleteEmployeeCommand } from './DeleteEmployeeCommand';

export class DeleteEmployeeValidator {
    private static schema = Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be positive',
            'any.required': 'ID is required',
        }),
    });

    static validate(command: DeleteEmployeeCommand): {
        isValid: boolean;
        errors: string[];
    } {
        const { error } = this.schema.validate(command, { abortEarly: false });

        if (error) {
            return {
                isValid: false,
                errors: error.details.map((detail) => detail.message),
            };
        }

        return { isValid: true, errors: [] };
    }
}
