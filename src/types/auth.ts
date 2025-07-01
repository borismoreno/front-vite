export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token?: string;
    user?: IUser;
    message?: string;
}

export interface IUser {
    rol: string;
    estado: boolean;
    nombre: string;
    email: string;
    empresa: string;
    pagoRegistrado: boolean;
    _id: string;
}