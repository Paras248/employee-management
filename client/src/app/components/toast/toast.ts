import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { IToastMessage } from '../../models/toast-message.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: IToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toasts = this.toastService.getToasts();
  }

  ngOnDestroy(): void {
    // Component cleanup if needed
  }

  removeToast(toast: IToastMessage): void {
    this.toastService.remove(toast);
    this.toasts = this.toastService.getToasts();
  }

  getToastClass(toast: IToastMessage): string {
    return `toast toast-${toast.type}`;
  }

  getToastIcon(toast: IToastMessage): string {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }
}
