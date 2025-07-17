import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICuota } from '../models/cuota.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CuotasService {
  private apiUrl = `${environment.apiUrl}/cuotas`;

  constructor(private http: HttpClient) {}

  getByVentaId(ventaId: number): Observable<ICuota[]> {
    return this.http.get<ICuota[]>(`${this.apiUrl}/venta/${ventaId}`);
  }

  confirmPay(id: number) {
    return this.http.patch<ICuota>(`${this.apiUrl}/${id}/confirm-pay`, {});
  }

  unconfirmPay(id: number) {
    return this.http.patch<ICuota>(`${this.apiUrl}/${id}/unconfirm-pay`, {});
  }

  create(cuota: ICuota): Observable<ICuota> {
    return this.http.post<ICuota>(this.apiUrl, cuota);
  }

  update(id: number, cuota: Partial<ICuota>): Observable<ICuota> {
    return this.http.put<ICuota>(`${this.apiUrl}/${id}`, cuota);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
