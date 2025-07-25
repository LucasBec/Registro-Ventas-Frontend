import { Component } from '@angular/core';
import { IDeudor } from '../../models/deudores.model';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deudores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deudores.component.html',
  styleUrls: ['./deudores.component.scss'],
})
export class DeudoresComponent {
  deudores: IDeudor[] = [];

  constructor(private ventasService: VentasService) {}

  ngOnInit() {
    this.ventasService.obtenerDeudores().subscribe((data) => {
      this.deudores = data.map((deudor) => {
        const totalDeuda = (deudor.cuotasImpagas || []).reduce((acc, cuota) => {
          const monto = typeof cuota.monto === 'string' ? parseFloat(cuota.monto) : cuota.monto;
          return acc + (isNaN(monto) ? 0 : monto);
        }, 0);

        return {
          ...deudor,
          totalDeuda,
        };
      });
    });
  }

  formatFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }

  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);
  }
}