import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployee } from '../models/employee.model';
import { ICreateEmployeeRequest } from '../models/create-employee-request.model';
import { IUpdateEmployeeRequest } from '../models/update-employee-request.model';
import { IApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  // Get all employees
  getAllEmployees(): Observable<IApiResponse<IEmployee[]>> {
    return this.http.get<IApiResponse<IEmployee[]>>(this.apiUrl);
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<IApiResponse<IEmployee>> {
    return this.http.get<IApiResponse<IEmployee>>(`${this.apiUrl}/${id}`);
  }

  // Create new employee
  createEmployee(employee: ICreateEmployeeRequest): Observable<IApiResponse<IEmployee>> {
    return this.http.post<IApiResponse<IEmployee>>(this.apiUrl, employee);
  }

  // Update employee
  updateEmployee(
    id: number,
    employee: IUpdateEmployeeRequest
  ): Observable<IApiResponse<IEmployee>> {
    return this.http.put<IApiResponse<IEmployee>>(`${this.apiUrl}/${id}`, employee);
  }

  // Delete employee
  deleteEmployee(id: number): Observable<IApiResponse<void>> {
    return this.http.delete<IApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Search employees
  searchEmployees(searchTerm: string): Observable<IApiResponse<IEmployee[]>> {
    const params = new HttpParams().set('q', searchTerm);
    return this.http.get<IApiResponse<IEmployee[]>>(`${this.apiUrl}/search`, { params });
  }
}
