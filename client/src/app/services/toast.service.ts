import { Injectable } from '@angular/core';
import { IToastMessage } from '../models/toast-message.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: IToastMessage[] = [];

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = 3000
  ): void {
    const toast: IToastMessage = { message, type, duration };
    this.toasts.push(toast);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  getToasts(): IToastMessage[] {
    return this.toasts;
  }

  remove(toast: IToastMessage): void {
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  clear(): void {
    this.toasts = [];
  }
}
