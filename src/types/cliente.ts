export interface ICliente {
    _id?: string;
    direccion: string;
    mail: string;
    numeroIdentificacion: string;
    razonSocial: string;
    telefono: string;
    tipoIdentificacion: string;
    totalMes?: number;
}