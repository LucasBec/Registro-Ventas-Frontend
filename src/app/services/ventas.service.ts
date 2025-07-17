import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICuota } from '../models/cuota.model';
import { IDeudor } from '../models/deudores.model';



export interface Venta {
  id?: number;
  comprador: string;
  modelo: string;
  precioVenta: number;
  precioCompra: number;
  formaPago: string;
  fecha: string;
  plataforma: string;
  confirmada: boolean;
  cuotas?: ICuota[]; 
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  getVentas(): Observable<Venta[]> {
    return this.http
      .get<Venta[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  crearVenta(venta: Venta): Observable<Venta> {
    return this.http
      .post<Venta>(this.apiUrl, venta)
      .pipe(catchError(this.handleError));
  }

  actualizarVenta(id: number, venta: Venta): Observable<Venta> {
    return this.http
      .put<Venta>(`${this.apiUrl}/${id}`, venta)
      .pipe(catchError(this.handleError));
  }

  actualizarCuotas(ventaId: number, cuotas: ICuota[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ventaId}/cuotas`, cuotas)
      .pipe(catchError(this.handleError));
  }

  obtenerDeudores(): Observable<IDeudor[]> {
    return this.http.get<IDeudor[]>(`${this.apiUrl}/deudores`);
  }
  
  eliminarVenta(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    console.error('Error desde el servicio de ventas:', error);
    let mensaje = 'Ocurrió un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      mensaje = `Error de red: ${error.error.message}`;
    } else if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor.';
    } else if (error.status >= 400 && error.status < 500) {
      mensaje = error.error.message || 'Error en la solicitud.';
    } else if (error.status >= 500) {
      mensaje = 'Error del servidor. Intente más tarde.';
    }
    return throwError(() => new Error(mensaje));
  }
}
