import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasService, Venta } from '../../services/ventas.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';
import { EditarVentaDialogComponent } from '../../components/ventas/editar-venta-dialog/editar-venta-dialog.component';
import { VentasFormComponent } from '../../components/ventas/ventas-form/ventas-form.component';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-ventas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './ventas-list.component.html',
})
export class VentasListComponent implements OnInit {
  ventas: Venta[] = [];
  fechaDesde: string = '';
  fechaHasta: string = '';
  modeloFiltro: string = '';
  compradorFiltro: string = '';
  plataformaFiltro: string = '';
  pagoFiltro: string = '';
  confirmadaFiltro: string = '';
  ventasOriginales: Venta[] = []; // copia sin filtrar
  editandoVenta: Venta | null = null;
  currentPage = 1;
  pageSize = 25;
  ventasFiltradas: Venta[] = [];

  readonly Edit = Edit;
  readonly Trash2 = Trash2;

  constructor(
    private ventasService: VentasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.recargarVentas();
  }

  recargarVentas() {
    this.ventasService.getVentas().subscribe({
      next: (data) => {
        this.ventasOriginales = data;
        this.aplicarFiltro();
      },
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(VentasFormComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.recargarVentas();
      }
    });
  }

  editarVenta(venta: Venta) {
    const dialogRef = this.dialog.open(EditarVentaDialogComponent, {
      width: '500px',
      data: venta,
    });

    dialogRef.afterClosed().subscribe((result: Venta | undefined) => {
      if (result && result.id) {
        this.ventasService.actualizarVenta(result.id, result).subscribe(() => {
          this.recargarVentas();
        });
      }
    });
  }

  guardarEdicion() {
    if (!this.editandoVenta || !this.editandoVenta.id) return;
  
    this.ventasService.actualizarVenta(this.editandoVenta.id, this.editandoVenta).subscribe({
      next: () => {
        this.editandoVenta = null;
        this.recargarVentas();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.snackBar.open('Error al actualizar la venta', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarVenta(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        titulo: 'Eliminar Venta',
        mensaje: '¿Estás seguro de que deseas eliminar esta venta?',
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ventasService.eliminarVenta(id).subscribe({
          next: () => {
            this.snackBar.open('Venta eliminada con éxito', 'Cerrar', { duration: 3000 });
            this.recargarVentas();
          },
          error: (err) => {
            console.error('Error al eliminar', err);
            this.snackBar.open('Error al eliminar la venta', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }

  calcularMargen(v: Venta): number {
    return Number(v.precioVenta) - Number(v.precioCompra);
  }

  get ventasPaginadas(): Venta[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.ventas.slice(start, start + this.pageSize);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ventas.length / this.pageSize);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.currentPage = pagina;
    }
  }

  aplicarFiltro(): void {
    let filtradas = [...this.ventasOriginales];

    if (this.fechaDesde) {
      filtradas = filtradas.filter((v) => v.fecha >= this.fechaDesde);
    }

    if (this.fechaHasta) {
      filtradas = filtradas.filter((v) => v.fecha <= this.fechaHasta);
    }

    if (this.modeloFiltro.trim()) {
      const modelo = this.modeloFiltro.toLowerCase();
      filtradas = filtradas.filter((v) =>
        v.modelo.toLowerCase().includes(modelo)
      );
    }

    if (this.compradorFiltro.trim()) {
      const comprador = this.compradorFiltro.toLowerCase();
      filtradas = filtradas.filter((v) =>
        v.comprador.toLowerCase().includes(comprador)
      );
    }

    if (this.plataformaFiltro) {
      filtradas = filtradas.filter(
        (v) => v.plataforma === this.plataformaFiltro
      );
    }

    if (this.pagoFiltro) {
      filtradas = filtradas.filter((v) => v.formaPago === this.pagoFiltro);
    }

    if (this.confirmadaFiltro) {
      if (this.confirmadaFiltro === 'true') {
        filtradas = filtradas.filter((v) => v.confirmada === true);
      } else if (this.confirmadaFiltro === 'false') {
        filtradas = filtradas.filter((v) => v.confirmada === false);
      }
    }
    this.currentPage = 1;
    this.ventas = filtradas;
  }

  limpiarFiltros(): void {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.modeloFiltro = '';
    this.plataformaFiltro = '';
    this.pagoFiltro = '';
    this.confirmadaFiltro = '';
    this.aplicarFiltro();
  }
}
