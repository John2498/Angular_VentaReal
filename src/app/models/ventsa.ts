import { Concepto } from './concepto';

export interface Venta {
    idCliente: number;
    idUsuario: number;
    estado: string;
    conceptos: Concepto[];
}
