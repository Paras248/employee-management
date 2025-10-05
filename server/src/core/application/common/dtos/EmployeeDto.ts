export class EmployeeDto {
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
        public readonly hireDate: Date,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}
