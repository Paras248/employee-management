import 'reflect-metadata';
import './container';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import employeeRoutes from './routes/employeeRoute';
import { globalExceptionHandler } from './middlewares/globalExceptionHandler';
import { swaggerSpec } from './swagger/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Swagger Documentation
app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Employee Management API',
    })
);

// Employee routes
app.use('/api/employees', employeeRoutes);

// Global exception handler (must be last middleware)
app.use(globalExceptionHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
