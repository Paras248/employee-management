# Employee Management Frontend

A modern Angular application for managing employee data with full CRUD operations, search functionality, and responsive design.

## Features

### Core CRUD Operations
- ✅ **Create** - Add new employees with comprehensive form validation
- ✅ **Read** - View all employees in a responsive table format
- ✅ **Update** - Edit existing employee information via modal dialog
- ✅ **Delete** - Remove employees with confirmation dialog

### Advanced Features
- ✅ **Search & Filter** - Real-time search by name, email, or position
- ✅ **Form Validation** - Comprehensive client-side validation with error messages
- ✅ **Responsive Design** - Mobile-friendly interface that works on all devices
- ✅ **Modern UI** - Material Design components with beautiful styling
- ✅ **Loading States** - Visual feedback during API operations
- ✅ **Error Handling** - User-friendly error messages and notifications

### Technical Features
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Angular Material** - Modern UI components and theming
- ✅ **Reactive Forms** - Form validation and state management
- ✅ **HTTP Client** - RESTful API communication
- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **SCSS Styling** - Custom styles with Material Design integration

## API Endpoints

The application connects to the following backend endpoints:

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/search?q=term` - Search employees

## Employee Data Model

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  position: string;
  department: string;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Angular CLI
- Backend API running on `http://localhost:3000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd employee-management-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Development

The application uses Angular 17+ with standalone components and modern features:

- **Components**: Modular, reusable components for different parts of the UI
- **Services**: HTTP service for API communication
- **Models**: TypeScript interfaces for type safety
- **Styling**: SCSS with Material Design theming

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── employee-list/          # Main employee table component
│   │   ├── employee-form/           # Create/Edit employee modal
│   │   └── employee-search/         # Search functionality
│   ├── models/
│   │   └── employee.model.ts       # TypeScript interfaces
│   ├── services/
│   │   └── employee.service.ts     # API communication
│   ├── app.ts                      # Main app component
│   ├── app.html                    # App template
│   └── app.scss                    # Global styles
├── styles.scss                    # Global Material Design styles
└── main.ts                         # Application bootstrap
```

## Usage

### Adding an Employee
1. Click the "Add Employee" button
2. Fill in the required information
3. The form validates input in real-time
4. Click "Create" to save the employee

### Editing an Employee
1. Click the edit icon (pencil) next to any employee
2. Modify the information in the form
3. Click "Update" to save changes

### Deleting an Employee
1. Click the delete icon (trash) next to any employee
2. Confirm the deletion in the dialog

### Searching Employees
1. Use the search bar at the top of the table
2. Type any part of the employee's name, email, or position
3. Results update in real-time as you type

## Form Validation

The application includes comprehensive form validation:

- **Required Fields**: Name, email, address, phone, position, department, dates
- **Email Validation**: Proper email format checking
- **Phone Validation**: International phone number format
- **Date Validation**: Proper date selection and range checking
- **Length Validation**: Minimum character requirements
- **Real-time Feedback**: Immediate validation as user types

## Responsive Design

The application is fully responsive and works on:

- **Desktop**: Full table view with all columns
- **Tablet**: Optimized layout with adjusted spacing
- **Mobile**: Stacked layout with touch-friendly controls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The application uses Angular Material for consistent UI components
- All API calls include proper error handling and user feedback
- The search functionality includes debouncing to prevent excessive API calls
- Form validation provides immediate feedback to improve user experience
- The application follows Angular best practices with standalone components

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure the backend server is running on port 3000
2. **CORS Issues**: The backend should be configured to allow requests from localhost:4200
3. **Build Errors**: Run `npm install` to ensure all dependencies are installed

### Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Lint code
ng lint
```

## Contributing

1. Follow Angular style guide
2. Use TypeScript for all new code
3. Add proper error handling
4. Include responsive design considerations
5. Test on multiple devices and browsers