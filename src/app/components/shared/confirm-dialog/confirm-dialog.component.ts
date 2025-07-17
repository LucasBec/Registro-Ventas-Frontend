import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="p-4 text-center">
      <h2 class="text-lg font-semibold mb-4">{{ data.titulo }}</h2>
      <p class="mb-6">{{ data.mensaje }}</p>
      <div class="flex justify-center gap-4">
        <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Confirmar</button>
        <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }
  ) {}
}