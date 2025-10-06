import Joi from 'joi';
import { UpdateEmployeeCommand } from './UpdateEmployeeCommand';

export class UpdateEmployeeValidator {
    private static schema = Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be an integer',
            'number.positive': 'ID must be positive',
            'any.required': 'ID is required',
        }),
        name: Joi.string().min(2).max(100).required().messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
        address: Joi.string().min(5).max(200).required().messages({
            'string.min': 'Address must be at least 5 characters long',
            'string.max': 'Address must not exceed 200 characters',
            'any.required': 'Address is required',
        }),
        phoneNumber: Joi.string()
            .pattern(/^[\+]?[1-9][\d]{0,15}$/)
            .required()
            .messages({
                'string.pattern.base': 'Please provide a valid phone number',
                'any.required': 'Phone number is required',
            }),
        dateOfBirth: Joi.date().max('now').required().messages({
            'date.max': 'Date of birth cannot be in the future',
            'any.required': 'Date of birth is required',
        }),
        gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
            'any.only': 'Gender must be Male, Female, or Other',
            'any.required': 'Gender is required',
        }),
        position: Joi.string().min(2).max(100).required().messages({
            'string.min': 'Position must be at least 2 characters long',
            'string.max': 'Position must not exceed 100 characters',
            'any.required': 'Position is required',
        }),
        department: Joi.string().min(2).max(100).required().messages({
            'string.min': 'Department must be at least 2 characters long',
            'string.max': 'Department must not exceed 100 characters',
            'any.required': 'Department is required',
        }),
        hireDate: Joi.date().max('now').required().messages({
            'date.max': 'Hire date cannot be in the future',
            'any.required': 'Hire date is required',
        }),
        isActive: Joi.boolean().required().messages({
            'any.required': 'isActive is required',
        }),
    });

    static validate(command: UpdateEmployeeCommand): {
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
