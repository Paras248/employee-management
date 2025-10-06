import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { ToastService } from '../../../services/toast.service';
import { IEmployee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-search.html',
  styleUrls: ['./employee-search.css'],
})
export class EmployeeSearchComponent implements OnInit {
  @Output() searchResults = new EventEmitter<IEmployee[]>();

  searchControl = new FormControl('');
  loading = false;

  constructor(private employeeService: EmployeeService, private toastService: ToastService) {}

  ngOnInit(): void {
    // Set up search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          if (!searchTerm || searchTerm.trim().length === 0) {
            // If search is empty, get all employees
            return this.employeeService.getAllEmployees();
          } else {
            // Perform search
            return this.employeeService.searchEmployees(searchTerm.trim());
          }
        }),
        catchError((error) => {
          console.error('Search error:', error);
          this.toastService.error('Error performing search');
          return of({ success: false, message: '', data: [] });
        })
      )
      .subscribe((response) => {
        this.loading = false;
        if (response.success) {
          this.searchResults.emit(response.data);
        }
      });
  }

  onSearchInput(): void {
    this.loading = true;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
