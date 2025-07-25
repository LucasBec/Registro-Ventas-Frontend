import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-snack',
  template: `
    <div [ngClass]="snackClasses" class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-md">
      <span class="text-xl">{{ icon }}</span>
      <span class="font-semibold">{{ data.message }}</span>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class CustomSnackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: 'success' | 'error' | 'info' | 'warn' }) {}

  get snackClasses() {
    switch (this.data.type) {
      case 'success':
        return 'bg-green-500 text-black';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      case 'warn':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-800 text-white';
    }
  }

  get icon() {
    switch (this.data.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      default:
        return '🔔';
    }
  }
}
