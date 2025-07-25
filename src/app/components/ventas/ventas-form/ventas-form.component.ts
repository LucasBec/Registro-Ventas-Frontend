import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService, Venta } from '../../../services/ventas.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSnackComponent } from '../../../shared/custom-snack/custom-snack.component';

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
    confirmada: true,
    cuotas: [],
  };

  cuotasPosibles = Array.from({ length: 12 }, (_, i) => i + 1);
  cantidadCuotas: number = 1;

  constructor(
    private ventasService: VentasService,
    public dialogRef: MatDialogRef<VentasFormComponent>,
    private snackBar: MatSnackBar
  ) {}

  onFormaPagoChange() {
    if (this.venta.formaPago !== 'Cuotas') {
      this.venta.cuotas = [];
    }
  }

  generarCuotas() {
    const cuotas = [];
    const fechaInicial = new Date(this.venta.fecha);
    const monto = parseFloat(
      (this.venta.precioVenta / this.cantidadCuotas).toFixed(2)
    );

    for (let i = 1; i <= this.cantidadCuotas; i++) {
      const fechaPago = new Date(fechaInicial);
      fechaPago.setMonth(fechaInicial.getMonth() + (i - 1));

      cuotas.push({
        numeroCuota: i,
        monto,
        fechaPago: fechaPago.toISOString().split('T')[0],
        pagada: false,
        ventaId: this.venta.id!,
      });
    }

    this.venta.cuotas = cuotas;
  }

  guardar() {
    if (this.venta.formaPago === 'Cuotas') {
      this.generarCuotas();
    } else {
      this.venta.cuotas = [];
    }

    const ventaFinal = { ...this.venta };

    this.ventasService.crearVenta(ventaFinal).subscribe({
      next: () => {
        this.snackBar.openFromComponent(CustomSnackComponent, {
          data: {
            message: 'Venta registrada con éxito',
            type: 'success'
          },
          duration: 3000,
          panelClass: ['custom-snack-container'],
        });
        this.dialogRef.close(true);
        this.resetFormulario();
      },
      error: (err) => {
        this.snackBar.openFromComponent(CustomSnackComponent, {
          data: {
            message: err.message,
            type: 'error'
          },
          duration: 4000,
          panelClass: ['custom-snack-container'],
        });
      },
    });
  }

  resetFormulario() {
    this.venta = {
      comprador: '',
      modelo: '',
      precioVenta: 0,
      precioCompra: 0,
      formaPago: 'Efectivo',
      fecha: new Date().toISOString().split('T')[0],
      plataforma: 'WhatsApp',
      confirmada: false,
      cuotas: [],
    };
    this.cantidadCuotas = 1;
  }
}
