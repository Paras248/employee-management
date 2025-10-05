import { container } from 'tsyringe';

import '@@infrastructure/InfrastructureRegistrationService';
import '@@application/ApplicationRegistrationService';
import { EmployeeController } from './controllers/EmployeeController';

container.register<EmployeeController>('EmployeeController', EmployeeController);

export { container };
