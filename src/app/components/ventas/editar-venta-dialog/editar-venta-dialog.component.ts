import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Venta } from '../../../models/venta.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-venta-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule, MatSnackBarModule],
  templateUrl: './editar-venta-dialog.component.html',
  styleUrl: './editar-venta-dialog.component.scss'
})
export class EditarVentaDialogComponent {
  venta: Venta;

  constructor(
    private dialogRef: MatDialogRef<EditarVentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Venta,
    private snackBar: MatSnackBar
  ) {
    this.venta = { ...data }; // copia local para editar
  }

  guardar() {
    this.dialogRef.close(this.venta);
    this.snackBar.open('Venta actualizada con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['custom-snackbar-success']
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
