import { Concepto } from "./concepto";

export interface VentaRes {
    id: number;
    idCliente: number;
    fecha: string;
    total: number;
    subtotal: number;
    estado: string;
    conceptos: Concepto[];
}