import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ToastService } from '../../../services/toast.service';
import { IEmployee } from '../../../models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form';
import { EmployeeSearchComponent } from '../employee-search/employee-search';
import { LoaderComponent } from '../../loader/loader';
import { ToastComponent } from '../../toast/toast';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeeSearchComponent,
    LoaderComponent,
    ToastComponent,
    EmployeeFormComponent,
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: IEmployee[] = [];
  loading = false;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedEmployee: IEmployee | null = null;
  deletingId: number | null = null;
  confirmingEmployee: IEmployee | null = null;

  constructor(private employeeService: EmployeeService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.data;
        this.loading = false;
        this.toastService.success('Employees loaded successfully');
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.toastService.error('Error loading employees');
        this.loading = false;
      },
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedEmployee = null;
    this.showModal = true;
  }

  openEditModal(employee: IEmployee): void {
    this.modalMode = 'edit';
    this.selectedEmployee = employee;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEmployee = null;
  }

  onEmployeeSaved(): void {
    this.closeModal();
    this.loadEmployees();
  }

  openConfirmDelete(employee: IEmployee): void {
    this.confirmingEmployee = employee;
  }

  cancelConfirmDelete(): void {
    this.confirmingEmployee = null;
  }

  confirmDelete(): void {
    if (!this.confirmingEmployee) {
      return;
    }
    const employee = this.confirmingEmployee;
    this.deletingId = employee.id;
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.toastService.success('Employee deleted successfully');
        this.deletingId = null;
        this.confirmingEmployee = null;
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.toastService.error('Error deleting employee');
        this.deletingId = null;
        this.confirmingEmployee = null;
      },
    });
  }

  onSearchResults(employees: IEmployee[]): void {
    this.employees = employees;
  }

  formatDate(date: Date | string | number | null | undefined): string {
    if (!date) {
      return '—';
    }
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return '—';
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
