export interface ICuota {
    id?: number;
    numeroCuota: number;
    monto: number;
    fechaPago: string;
    pagada?: boolean;
    ventaId: number;
}
  