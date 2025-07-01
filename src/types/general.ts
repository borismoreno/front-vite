export interface IGenericResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface ITipoIdentificacion {
    codigo: string;
    tipoIdentificacion: string;
}