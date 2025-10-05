export class UpdateEmployeeCommand {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly email: string,
        public readonly address: string,
        public readonly phoneNumber: string,
        public readonly dateOfBirth: Date,
        public readonly gender: string,
        public readonly position: string,
        public readonly department: string,
        public readonly hireDate: Date
    ) {}
}
