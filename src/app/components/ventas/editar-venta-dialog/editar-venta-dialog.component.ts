import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IVenta } from '../../../models/venta.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CustomSnackComponent } from '../../../shared/custom-snack/custom-snack.component';

@Component({
  selector: 'app-editar-venta-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './editar-venta-dialog.component.html',
  styleUrl: './editar-venta-dialog.component.scss'
})
export class EditarVentaDialogComponent {
  venta: IVenta;
  cantidadCuotas: number = 1;
  cuotasDisponibles = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(
    private dialogRef: MatDialogRef<EditarVentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVenta,
    private snackBar: MatSnackBar,
  ) {
    this.venta = { ...data };
    this.cantidadCuotas = this.venta.cuotas?.length || 1;
  }

  ajustarCuotas() {
    if (!this.venta.cuotas) this.venta.cuotas = [];
  
    const cuotasOriginales = [...this.venta.cuotas];
    const diferencia = this.cantidadCuotas - cuotasOriginales.length;
    const montoPorCuota = parseFloat((this.venta.precioVenta / this.cantidadCuotas).toFixed(2));
    const fechaBase = new Date(this.venta.fecha);
  
    if (diferencia > 0) {
      for (let i = cuotasOriginales.length; i < this.cantidadCuotas; i++) {
        const fechaPago = new Date(fechaBase);
        fechaPago.setMonth(fechaBase.getMonth() + i);
  
        cuotasOriginales.push({
          numeroCuota: i + 1,
          monto: montoPorCuota,
          fechaPago: fechaPago.toISOString().split('T')[0],
          pagada: false,
          ventaId: this.venta.id!
        });
      }
    } else if (diferencia < 0) {
      const cuotasPagadas = cuotasOriginales.filter(c => c.pagada);
      if (this.cantidadCuotas < cuotasPagadas.length) {
        this.snackBar.openFromComponent(CustomSnackComponent, {
          data: {
            message: 'No se puede reducir por debajo de las cuotas ya pagadas',
            type: 'warn'
          },
          duration: 3000,
          panelClass: ['custom-snack-container']
        });
        this.cantidadCuotas = cuotasOriginales.length;
        return;
      }
  
      cuotasOriginales.length = this.cantidadCuotas;
    }
  
    this.venta.cuotas = cuotasOriginales.map((cuota, idx) => {
      const nuevaFecha = new Date(fechaBase);
      nuevaFecha.setMonth(fechaBase.getMonth() + idx);
  
      return {
        ...cuota,
        numeroCuota: idx + 1,
        monto: montoPorCuota,
        fechaPago: nuevaFecha.toISOString().split('T')[0]
      };
    });
  };

  guardar() {
    this.dialogRef.close(this.venta);
  }

  cancelar() {
    this.dialogRef.close();
  }
}