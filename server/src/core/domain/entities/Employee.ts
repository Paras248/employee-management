export class Employee {
    constructor(
        public id: number,
        public email: string,
        public name: string,
        public address: string,
        public phoneNumber: string,
        public dateOfBirth: Date,
        public gender: string,
        public position: string,
        public department: string,
        public hireDate: Date,
        public isActive: boolean = true,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}
