const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Employee Management System API',
        version: '1.0.0',
        description:
            'A comprehensive API for managing employees with CRUD operations, search functionality, and SQLite database integration.',
        contact: {
            name: 'API Support',
            email: 'support@example.com',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    paths: {
        '/api/employees': {
            get: {
                tags: ['Employees'],
                summary: 'Get all employees',
                description: 'Retrieve a list of all employees',
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/EmployeeListResponse',
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Employees'],
                summary: 'Create a new employee',
                description: 'Create a new employee record',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CreateEmployeeRequest',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Employee created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/employees/search': {
            get: {
                tags: ['Employees'],
                summary: 'Search employees',
                description: 'Search employees by name',
                parameters: [
                    {
                        $ref: '#/components/parameters/SearchQuery',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Search completed successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/EmployeeListResponse',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/employees/{id}': {
            get: {
                tags: ['Employees'],
                summary: 'Get employee by ID',
                description: 'Retrieve a specific employee by ID',
                parameters: [
                    {
                        $ref: '#/components/parameters/EmployeeId',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Employee found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Employee not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse',
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ['Employees'],
                summary: 'Update employee',
                description: 'Update an existing employee',
                parameters: [
                    {
                        $ref: '#/components/parameters/EmployeeId',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UpdateEmployeeRequest',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Employee updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ['Employees'],
                summary: 'Delete employee',
                description: 'Delete an employee by ID',
                parameters: [
                    {
                        $ref: '#/components/parameters/EmployeeId',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Employee deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiResponse',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Employee: {
                type: 'object',
                required: [
                    'id',
                    'email',
                    'name',
                    'address',
                    'phoneNumber',
                    'dateOfBirth',
                    'gender',
                    'position',
                    'department',
                    'hireDate',
                    'isActive',
                    'createdAt',
                    'updatedAt',
                ],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Unique identifier for the employee',
                        example: 1,
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email address of the employee',
                        example: 'john.doe@company.com',
                    },
                    name: {
                        type: 'string',
                        description: 'Full name of the employee',
                        example: 'John Doe',
                    },
                    address: {
                        type: 'string',
                        description: 'Address of the employee',
                        example: '123 Main St, City, State 12345',
                    },
                    phoneNumber: {
                        type: 'string',
                        description: 'Phone number of the employee',
                        example: '1234567890',
                    },
                    dateOfBirth: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date of birth (ISO 8601)',
                        example: '1990-01-15T00:00:00.000Z',
                    },
                    gender: {
                        type: 'string',
                        enum: ['Male', 'Female', 'Other'],
                        description: 'Gender of the employee',
                        example: 'Male',
                    },
                    position: {
                        type: 'string',
                        description: 'Job position of the employee',
                        example: 'Software Engineer',
                    },
                    department: {
                        type: 'string',
                        description: 'Department of the employee',
                        example: 'Engineering',
                    },
                    hireDate: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Hire date (ISO 8601)',
                        example: '2020-01-15T00:00:00.000Z',
                    },
                    isActive: {
                        type: 'boolean',
                        description: 'Whether the employee is active',
                        example: true,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Timestamp when the employee was created',
                        example: '2020-01-15T00:00:00.000Z',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Timestamp when the employee was last updated',
                        example: '2020-01-15T00:00:00.000Z',
                    },
                },
            },
            CreateEmployeeRequest: {
                type: 'object',
                required: [
                    'name',
                    'email',
                    'address',
                    'phoneNumber',
                    'dateOfBirth',
                    'gender',
                    'position',
                    'department',
                    'hireDate',
                ],
                properties: {
                    name: {
                        type: 'string',
                        description: 'Full name of the employee',
                        example: 'John Doe',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email address of the employee',
                        example: 'john.doe@company.com',
                    },
                    address: {
                        type: 'string',
                        description: 'Address of the employee',
                        example: '123 Main St, City, State 12345',
                    },
                    phoneNumber: {
                        type: 'string',
                        description: 'Phone number of the employee',
                        example: '1234567890',
                    },
                    dateOfBirth: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date of birth (ISO 8601)',
                        example: '1990-01-15T00:00:00.000Z',
                    },
                    gender: {
                        type: 'string',
                        enum: ['Male', 'Female', 'Other'],
                        description: 'Gender of the employee',
                        example: 'Male',
                    },
                    position: {
                        type: 'string',
                        description: 'Job position of the employee',
                        example: 'Software Engineer',
                    },
                    department: {
                        type: 'string',
                        description: 'Department of the employee',
                        example: 'Engineering',
                    },
                    hireDate: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Hire date (ISO 8601)',
                        example: '2020-01-15T00:00:00.000Z',
                    },
                },
            },
            UpdateEmployeeRequest: {
                type: 'object',
                required: [
                    'name',
                    'email',
                    'address',
                    'phoneNumber',
                    'dateOfBirth',
                    'gender',
                    'position',
                    'department',
                    'hireDate',
                    'isActive',
                ],
                properties: {
                    name: {
                        type: 'string',
                        description: 'Full name of the employee',
                        example: 'John Updated',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email address of the employee',
                        example: 'john.updated@company.com',
                    },
                    address: {
                        type: 'string',
                        description: 'Address of the employee',
                        example: '456 Updated St, City, State 12345',
                    },
                    phoneNumber: {
                        type: 'string',
                        description: 'Phone number of the employee',
                        example: '1234567890',
                    },
                    dateOfBirth: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date of birth (ISO 8601)',
                        example: '1990-01-15T00:00:00.000Z',
                    },
                    gender: {
                        type: 'string',
                        enum: ['Male', 'Female', 'Other'],
                        description: 'Gender of the employee',
                        example: 'Male',
                    },
                    position: {
                        type: 'string',
                        description: 'Job position of the employee',
                        example: 'Senior Software Engineer',
                    },
                    department: {
                        type: 'string',
                        description: 'Department of the employee',
                        example: 'Engineering',
                    },
                    hireDate: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Hire date (ISO 8601)',
                        example: '2020-01-15T00:00:00.000Z',
                    },
                    isActive: {
                        type: 'boolean',
                        description: 'Whether the employee is active',
                        example: true,
                    },
                },
            },
            ApiResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        description: 'Indicates if the request was successful',
                        example: true,
                    },
                    data: {
                        type: 'object',
                        description: 'Response data',
                    },
                    message: {
                        type: 'string',
                        description: 'Response message',
                        example: 'Operation completed successfully',
                    },
                },
            },
            EmployeeListResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        description: 'Indicates if the request was successful',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        description: 'Response message',
                        example: 'Employees retrieved successfully',
                    },
                    data: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Employee',
                        },
                        description: 'List of employees',
                    },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false,
                    },
                    message: {
                        type: 'string',
                        description: 'Error message',
                        example: 'Employee with ID 999 not found',
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'List of error details',
                        example: [],
                    },
                },
            },
        },
        parameters: {
            EmployeeId: {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    type: 'integer',
                },
                description: 'Employee ID',
                example: 1,
            },
            SearchQuery: {
                name: 'q',
                in: 'query',
                required: true,
                schema: {
                    type: 'string',
                },
                description: 'Search term for employee name',
                example: 'john',
            },
        },
        responses: {
            Success: {
                description: 'Successful operation',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ApiResponse',
                        },
                    },
                },
            },
            BadRequest: {
                description: 'Bad request - Invalid input',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                    },
                },
            },
            NotFound: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                    },
                },
            },
            InternalServerError: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ErrorResponse',
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Employees',
            description: 'Employee management operations',
        },
    ],
};

export const swaggerSpec = swaggerDefinition;
