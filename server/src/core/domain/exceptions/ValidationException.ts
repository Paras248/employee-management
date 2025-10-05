export class ValidationException extends Error {
    validationErrors: string[];

    constructor(validationErrors: string[] = []) {
        super("Provided data is not valid");
        this.validationErrors = validationErrors;
        this.name = "ValidationException";
    }
}
