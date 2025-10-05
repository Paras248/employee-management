module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/**/ApplicationRegistrationService.ts',
        '!src/**/InfrastructureRegistrationService.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    moduleNameMapper: {
        '^@@domain/(.*)$': '<rootDir>/src/core/domain/$1',
        '^@@application/(.*)$': '<rootDir>/src/core/application/$1',
        '^@@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    },
};
