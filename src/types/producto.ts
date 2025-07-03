export interface IProducto {
    id?: string;
    // activo: boolean;
    codigoPrincipal?: string;
    codigoAuxiliar?: string;
    tipoProducto: string;
    tipoProductoDescripcion?: string;
    tarifaIva: string;
    tarifaIvaDescripcion?: string;
    descripcion: string;
    valorUnitario: number;
}