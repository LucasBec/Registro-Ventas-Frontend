import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService, Venta } from '../../../services/ventas.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-ventas-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './ventas-form.component.html',
})
export class VentasFormComponent {
  venta: Venta = {
    comprador: '',
    modelo: '',
    precioVenta: 0,
    precioCompra: 0,
    formaPago: 'Efectivo',
    fecha: new Date().toISOString().split('T')[0],
    plataforma: 'WhatsApp',
    confirmada: false
  };

  constructor(
    private ventasService: VentasService,
    public dialogRef: MatDialogRef<VentasFormComponent>,
    private snackBar: MatSnackBar) {}

    guardar() {
      this.ventasService.crearVenta(this.venta).subscribe({
        next: () => {
          this.snackBar.open('Venta registrada con éxito', 'Cerrar', {
            duration: 3000,
            panelClass: ['bg-green-600', 'text-white']
          });
        this.dialogRef.close(true);
        this.venta = {
          comprador: '',
          modelo: '',
          precioVenta: 0,
          precioCompra: 0,
          formaPago: 'Efectivo',
          fecha: new Date().toISOString().split('T')[0],
          plataforma: 'WhatsApp',
          confirmada: false
        };
      },
      error: err => {
        this.snackBar.open(err.message, 'Cerrar', {
          duration: 4000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }
}
