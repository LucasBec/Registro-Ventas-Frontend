import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService, Venta } from '../../services/ventas.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  ventas: Venta[] = [];
  totalVentas = 0;
  gananciaTotal = 0;
  porPlataforma: Record<string, number> = {};
  porPago: Record<string, number> = {};
  fechaDesde: string = '';
  fechaHasta: string = '';
  plataformaFiltro: string = '';
  pagoFiltro: string = '';
  confirmadaFiltro: string = '';

  plataformaChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  pagoChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.ventasService.getVentas().subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        this.aplicarFiltro();
      },
      error: (err) => console.error('Error al obtener ventas', err),
    });
  }

  aplicarFiltro(): void {
    let ventasFiltradas = [...this.ventas];

    if (this.fechaDesde) {
      ventasFiltradas = ventasFiltradas.filter(v => v.fecha >= this.fechaDesde);
    }

    if (this.fechaHasta) {
      ventasFiltradas = ventasFiltradas.filter(v => v.fecha <= this.fechaHasta);
    }

    if (this.plataformaFiltro) {
      ventasFiltradas = ventasFiltradas.filter(v => v.plataforma === this.plataformaFiltro);
    }

    if (this.pagoFiltro) {
      ventasFiltradas = ventasFiltradas.filter(v => v.formaPago === this.pagoFiltro);
    }

    if (this.confirmadaFiltro) {
      if (this.confirmadaFiltro === 'true') {
        ventasFiltradas = ventasFiltradas.filter(v => v.confirmada === true);
      } else if (this.confirmadaFiltro === 'false') {
        ventasFiltradas = ventasFiltradas.filter(v => v.confirmada === false);
      }
    }

    this.calcularEstadisticas(ventasFiltradas);
  }

  limpiarFiltros(): void {
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.plataformaFiltro = '';
    this.pagoFiltro = '';
    this.confirmadaFiltro = '';
    this.aplicarFiltro();
  }

  calcularEstadisticas(lista: Venta[]) {
    this.totalVentas = lista.length;
    this.gananciaTotal = 0;
    this.porPlataforma = {};
    this.porPago = {};

    for (const v of lista) {
      this.gananciaTotal += Number(v.precioVenta) - Number(v.precioCompra);
      this.porPlataforma[v.plataforma] = (this.porPlataforma[v.plataforma] || 0) + 1;
      this.porPago[v.formaPago] = (this.porPago[v.formaPago] || 0) + 1;
    }

    this.actualizarGraficos();
  }

  actualizarGraficos() {
    this.plataformaChartData = {
      labels: Object.keys(this.porPlataforma),
      datasets: [
        {
          data: Object.values(this.porPlataforma),
          backgroundColor: ['#7c3aed', '#0ec043', '#0866ff', '#f59e0b', '#ef4444', '#8b5cf6'], 
          hoverBackgroundColor: ['#7c3aed', '#0ec043', '#0866ff', '#f59e0b', '#ef4444', '#8b5cf6'],
          hoverBorderColor: '#000000',
          hoverBorderWidth: 2,
        }
      ]
    };

    this.pagoChartData = {
      labels: Object.keys(this.porPago),
      datasets: [
        {
          data: Object.values(this.porPago),
          backgroundColor: ['#22c55e','#f97316', '#0ea5e9', '#e11d48', '#7c3aed'],
          hoverBackgroundColor: ['#22c55e','#f97316', '#0ea5e9', '#e11d48', '#7c3aed'],
          hoverBorderColor: '#000000',
          hoverBorderWidth: 2,
        }
      ]
    };
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
