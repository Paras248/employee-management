import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ToastService } from '../../../services/toast.service';
import { IEmployee } from '../../../models/employee.model';
import { ICreateEmployeeRequest } from '../../../models/create-employee-request.model';
import { IUpdateEmployeeRequest } from '../../../models/update-employee-request.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.css'],
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() employee?: IEmployee | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  employeeForm: FormGroup;
  loading = false;

  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  departmentOptions = [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.employee) {
      this.populateForm(this.employee);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['employee'] || changes['mode']) && this.mode === 'edit' && this.employee) {
      this.populateForm(this.employee);
    }
    if (changes['mode'] && this.mode === 'create') {
      this.employeeForm.reset();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
        dateOfBirth: ['', [Validators.required, this.noFutureDateValidator]],
        gender: ['', [Validators.required]],
        position: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        department: ['', [Validators.required]],
        hireDate: ['', [Validators.required, this.noFutureDateValidator]],
        // isActive is controlled by backend default on create; shown only in edit mode
        isActive: [true],
      },
      { validators: this.dobBeforeOrEqualHireValidator }
    );
  }

  private populateForm(employee: IEmployee): void {
    const safeDate = (d: any) => {
      const dt = d ? new Date(d) : null;
      return dt && !isNaN(dt.getTime()) ? dt.toISOString().split('T')[0] : '';
    };

    this.employeeForm.patchValue({
      name: employee?.name || '',
      email: employee?.email || '',
      address: employee?.address || '',
      phoneNumber: employee?.phoneNumber || '',
      dateOfBirth: safeDate(employee?.dateOfBirth),
      gender: employee?.gender || '',
      position: employee?.position || '',
      department: employee?.department || '',
      hireDate: safeDate(employee?.hireDate),
      isActive: !!employee?.isActive,
    });
  }

  // Ensure selected date is not in the future
  private noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const selected = new Date(value);
    const today = new Date();
    // Compare using only the date portion
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected > today ? { futureDate: true } : null;
  }

  // Cross-field validator: DOB must be <= Hire Date
  private dobBeforeOrEqualHireValidator(group: AbstractControl): ValidationErrors | null {
    const dob = group.get('dateOfBirth')?.value;
    const hire = group.get('hireDate')?.value;
    if (!dob || !hire) {
      return null;
    }
    const dobDate = new Date(dob);
    const hireDate = new Date(hire);
    dobDate.setHours(0, 0, 0, 0);
    hireDate.setHours(0, 0, 0, 0);
    return dobDate > hireDate ? { dobAfterHire: true } : null;
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      const formValue = this.employeeForm.value;

      if (this.mode === 'create') {
        const createRequest: ICreateEmployeeRequest = {
          name: formValue.name,
          email: formValue.email,
          address: formValue.address,
          phoneNumber: formValue.phoneNumber,
          dateOfBirth: new Date(formValue.dateOfBirth),
          gender: formValue.gender,
          position: formValue.position,
          department: formValue.department,
          hireDate: new Date(formValue.hireDate),
        };

        this.employeeService.createEmployee(createRequest).subscribe({
          next: (response) => {
            this.toastService.success('Employee created successfully');
            this.saved.emit();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating employee:', error);
            this.toastService.error('Error creating employee');
            this.loading = false;
          },
        });
      } else {
        const updateRequest: IUpdateEmployeeRequest = {
          name: formValue.name,
          email: formValue.email,
          address: formValue.address,
          phoneNumber: formValue.phoneNumber,
          dateOfBirth: new Date(formValue.dateOfBirth),
          gender: formValue.gender,
          position: formValue.position,
          department: formValue.department,
          hireDate: new Date(formValue.hireDate),
          isActive: !!formValue.isActive,
        };

        this.employeeService.updateEmployee(this.employee!.id, updateRequest).subscribe({
          next: (response) => {
            this.toastService.success('Employee updated successfully');
            this.saved.emit();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.toastService.error('Error updating employee');
            this.loading = false;
          },
        });
      }
    } else {
      this.markFormGroupTouched();
      this.toastService.warning('Please fill in all required fields correctly');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('futureDate')) {
      return `${this.getFieldLabel(fieldName)} cannot be in the future`;
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${
        control.errors?.['minlength'].requiredLength
      } characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${this.getFieldLabel(fieldName)} must not exceed ${
        control.errors?.['maxlength'].requiredLength
      } characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    // Cross-field error on the form group
    if (fieldName === 'dateOfBirth' || fieldName === 'hireDate') {
      if (this.employeeForm?.errors?.['dobAfterHire']) {
        return 'Date of Birth cannot be after Hire Date';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      address: 'Address',
      phoneNumber: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      position: 'Position',
      department: 'Department',
      hireDate: 'Hire Date',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
