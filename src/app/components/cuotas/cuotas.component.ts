import { Component, OnInit, Input } from '@angular/core';
import { ICuota } from '../../models/cuota.model';
import { CuotasService } from '../../services/cuotas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { IVenta } from '../../models/venta.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cuotas',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './cuotas.component.html',
  styleUrl: './cuotas.component.scss',
})
export class CuotasComponent implements OnInit {
  cuotas: ICuota[] = [];
  cargando = true;
  @Input() ventaId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public venta: IVenta,
    private cuotasService: CuotasService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cuotasService.getByVentaId(this.venta.id!).subscribe({
      next: (data: ICuota[]) => {
        this.cuotas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.snackBar.open('Error al cargar las cuotas', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white'],
        });
      },
    });
  }

  agregarCuota() {
    const nueva: ICuota = {
      numeroCuota: this.cuotas.length + 1,
      monto: 0,
      fechaPago: new Date().toISOString().split('T')[0],
      pagada: false,
      ventaId: this.ventaId!,
    };

    this.cuotasService.create(nueva).subscribe((c) => this.cuotas.push(c));
  }

  confirmarPago(cuota: ICuota) {
    // Validar que todas las cuotas anteriores estén pagadas
    const cuotasAnteriores = this.cuotas
      .filter(c => c.numeroCuota < cuota.numeroCuota);
  
    const hayImpagas = cuotasAnteriores.some(c => !c.pagada);
  
    if (hayImpagas) {
      this.snackBar.open(
        `No se puede confirmar la cuota #${cuota.numeroCuota} hasta que todas las anteriores estén pagadas.`,
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['bg-yellow-700', 'text-white'],
        }
      );
      return;
    }
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        titulo: 'Confirmar Pago',
        mensaje: '¿Estás seguro de que deseas confirmar el pago de esta cuota?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cuotasService.confirmPay(cuota.id!).subscribe({
          next: () => {
            this.snackBar.open(
              `Cuota #${cuota.numeroCuota} marcada como pagada`,
              'Cerrar',
              {
                duration: 3000,
                panelClass: ['bg-green-600', 'text-white'],
              }
            );
            cuota.pagada = true;
          },
          error: () => {
            this.snackBar.open('Error al confirmar el pago', 'Cerrar', {
              duration: 3000,
              panelClass: ['bg-red-600', 'text-white'],
            });
          },
        });
      }
    });
  }

  esConfirmable(cuota: ICuota): boolean {
    const cuotasAnteriores = this.cuotas.filter(
      c => c.numeroCuota < cuota.numeroCuota
    );
    return cuotasAnteriores.every(c => c.pagada);
  }

  desconfirmarPago(cuota: ICuota) {
    if (!cuota.id) return;
  
    this.cuotasService.unconfirmPay(cuota.id).subscribe({
      next: () => {
        this.snackBar.open(`Cuota #${cuota.numeroCuota} desconfirmada`, 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-yellow-600', 'text-white']
        });
        cuota.pagada = false;
      },
      error: () => {
        this.snackBar.open('Error al desconfirmar la cuota', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }

  actualizarCuota(cuota: ICuota) {
    this.cuotasService.update(cuota.id!, { pagada: cuota.pagada }).subscribe();
  }

  actualizarFechaPago(cuota: ICuota) {
    this.cuotasService.update(cuota.id!, {
      fechaPago: cuota.fechaPago
    }).subscribe({
      next: () => {
        this.snackBar.open(`Fecha de pago actualizada`, 'Cerrar', {
          duration: 2500,
          panelClass: ['bg-blue-600', 'text-white']
        });
      },
      error: () => {
        this.snackBar.open('Error al actualizar la fecha', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }

  eliminarCuota(id: number) {
    this.cuotasService.delete(id).subscribe(() => {
      this.cuotas = this.cuotas.filter((c) => c.id !== id);
    });
  }
}
