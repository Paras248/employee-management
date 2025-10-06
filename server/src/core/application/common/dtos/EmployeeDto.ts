export class EmployeeDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly email: string,
        public readonly address: string,
        public readonly phoneNumber: string,
        public readonly dateOfBirth: string,
        public readonly gender: string,
        public readonly position: string,
        public readonly department: string,
        public readonly hireDate: string,
        public readonly isActive: boolean,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}
}
