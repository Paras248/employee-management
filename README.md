## Employee Management - Monorepo (Server + Client)

This repository contains a TypeScript Node.js backend (Express) and an Angular frontend for managing employees.

### Prerequisites

-   Node.js 18+
-   npm 9+

### Project Structure

```text
employee-management/
  ├─ server/   # Node.js + Express + SQLite + DI + Jest
  └─ client/   # Angular 20 standalone components
```

## Run the Server (API)

```bash
cd server
npm install
npm run dev
```

-   API base URL: `http://localhost:3000`
-   Swagger UI: `http://localhost:3000/api/docs`

To build and run in production mode:

```bash
cd server
npm run build
npm start
```

## Run the Client (Angular)

```bash
cd client
npm install
npm start
```

-   App URL: `http://localhost:4200`
-   The client communicates with the server at `http://localhost:3000`

## Run Server Tests

```bash
cd server
npm test
```

Jest runs unit tests under `server/tests/**`.

## Code Architecture

### Backend (Detailed Folder Structure)

Why this structure: It enforces separation of concerns, testability, and the dependency rule (outer layers depend on inner abstractions, never the reverse). Each folder has a single responsibility and can be evolved independently.

```
server/src/
  core/                                   # Application-agnostic business code
    domain/                               # Pure domain concerns (no framework code)
      entities/
        Employee.ts                       # Domain entity: canonical employee model and invariants
      exceptions/
        BadRequestException.ts            # Signals invalid client input (400)
        NotFoundException.ts              # Signals missing aggregate/entity (404)
        ValidationException.ts            # Signals validation failures from application layer
      contracts/                          # Dependency inversion boundaries
        repositories/
          IEmployeeRepository.ts          # Interface for persistence operations used by use-cases
        external-services/
          ILogger.ts                      # Interface for logging (implemented by infrastructure)

    application/                          # Use-cases orchestrating domain + IO via contracts
      features/
        employee/
          commands/                       # Write-side use-cases (cause state changes)
            createEmployee/               # Input DTO, validator, handler for create
            updateEmployee/               # Input DTO, validator, handler for update
            deleteEmployee/               # Input DTO, validator, handler for delete
          queries/                        # Read-side use-cases (no side effects)
            getEmployee/                  # Handler to fetch a single employee
            getAllEmployees/              # Handler to list employees
            searchEmployees/              # Handler to search employees
      common/
        dtos/                             # Application DTOs (shape exposed to presentation)
        mappers/                          # Map domain entities <-> DTOs
        transformers/                     # Cross-cutting transforms (e.g., normalization)
      responses/
        Response.ts                       # Canonical success/error response models

  infrastructure/                         # Tech/framework details hidden behind contracts
    persistence/
      repositories/
        EmployeeRepository.ts             # SQLite-backed repository implements IEmployeeRepository
      services/
        DbConnectionService.ts            # SQLite connection lifecycle and access helper
    external-service/
      logger/
        WinstonLogger.ts                  # ILogger implementation using winston + rotate
    InfrastructureRegistrationService.ts  # Binds interfaces to concretes for DI

  presentation/                           # HTTP API: Express adapters and wiring
    container.ts                          # Tsyringe DI registrations and tokens
    controllers/
      EmployeeController.ts               # Translates HTTP -> use-case -> HTTP
    routes/
      employeeRoute.ts                    # Express Router defines endpoints -> controller methods
    middlewares/
      globalExceptionHandler.ts           # Maps exceptions -> consistent HTTP responses
    swagger/
      swagger.ts                          # OpenAPI 3.0 spec served at /api/docs
    transformers/
      RequestTransformers.ts              # Request parsing/sanitization helpers
      ResponseTransformers.ts             # HTTP response shaping helpers
    index.ts                              # App bootstrap: CORS, JSON, routes, swagger, listen
```

Key principles applied:

-   Dependency inversion: presentation/infrastructure depend on application/domain abstractions; not vice versa.
-   Clear read/write separation: commands mutate state; queries only read.
-   Controllers are thin: validate/transform request, invoke a single use-case, transform response.
-   Repositories hide data layer details: swapping SQLite for another DB only touches infrastructure.
-   Centralized error handling: domain/application exceptions mapped to HTTP statuses in one place.

Data flow for a typical request (example: Update Employee):

1. `PUT /api/employees/:id` hits `presentation/routes/employeeRoute.ts`.
2. Route invokes `EmployeeController.updateEmployee`.
3. Controller builds a command DTO and calls the corresponding application handler.
4. Handler validates input (via validator), loads entity from repository, applies changes, persists via repository.
5. Handler returns an application-level response; controller maps it to HTTP JSON.
6. Errors bubble to `globalExceptionHandler` and are normalized into error responses.

### Frontend (Brief)

Minimal but clear structure to keep views/components isolated and strongly typed:

```
client/src/app/
  components/
    employee/
      employee-list/                    # Table + CRUD triggers (lazy loaded)
      employee-form/                    # Reactive form with validation (no future dates, DOB ≤ hire)
      employee-search/                  # Search input with debounce
    loader/                             # Simple loading indicator
    toast/                              # Toast UI for notifications
  models/
    employee.model.ts                   # IEmployee
    create-employee-request.model.ts    # ICreateEmployeeRequest
    update-employee-request.model.ts    # IUpdateEmployeeRequest
    api-response.model.ts               # IApiResponse<T>
    toast-message.model.ts              # IToastMessage
  services/
    employee.service.ts                 # HTTP calls to /api/employees
    toast.service.ts                    # In-memory toast queue
  app.routes.ts                         # Lazy route to employee list
  app.ts                                # Root component
```

Notes:

-   Strongly typed API surface via I-prefixed interfaces improves compile-time safety.
-   Reactive Forms centralize validation rules with clear error messages.
-   Standalone components (Angular 15+) reduce NgModule overhead and simplify lazy loading.

## Notes

-   Server logs are written under `server/logs/`.
-   Update server port via `PORT` env var; default is `3000`.
-   Client form validations prevent future dates and require DOB ≤ Hire Date.
