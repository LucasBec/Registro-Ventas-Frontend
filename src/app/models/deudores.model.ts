import { ICuota } from "./cuota.model";

export interface IDeudor {
    comprador: string;
    modelo: string;
    totalDeuda: number;
    cuotasImpagas: ICuota[];
}