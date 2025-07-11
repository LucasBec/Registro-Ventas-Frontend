export interface Venta {
    id?: number; 
    comprador: string;
    modelo: string;
    precioVenta: number;
    precioCompra: number;
    formaPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Cuotas';
    fecha: string;
    plataforma: 'Facebook' | 'Instagram' | 'WhatsApp' | 'Otro';
    confirmada: boolean;
}