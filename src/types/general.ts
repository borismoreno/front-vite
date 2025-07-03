export interface IGenericResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface ITipoIdentificacion {
    codigo: string;
    tipoIdentificacion: string;
}

export interface ITipoProducto {
    codigo: string;
    descripcion: string;
}

export interface ITarifaIva {
    codigo: string;
    porcentaje: string;
}