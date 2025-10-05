import { Router } from 'express';
import { container } from 'tsyringe';
import { EmployeeController } from '../controllers/EmployeeController';

const router = Router();

const employeeController = container.resolve<EmployeeController>('EmployeeController');

// GET /api/employees - Get all employees
router.get('/', (req, res) => employeeController.getAllEmployees(req, res));

// GET /api/employees/search?q=searchTerm - Search employees by name
router.get('/search', (req, res) => employeeController.searchEmployees(req, res));

// GET /api/employees/:id - Get employee by ID
router.get('/:id', (req, res) => employeeController.getEmployeeById(req, res));

// POST /api/employees - Create new employee
router.post('/', (req, res) => employeeController.createEmployee(req, res));

// PUT /api/employees/:id - Update employee
router.put('/:id', (req, res) => employeeController.updateEmployee(req, res));

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', (req, res) => employeeController.deleteEmployee(req, res));

export default router;
