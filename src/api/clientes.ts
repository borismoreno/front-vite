import { fetchSinToken } from "../helpers/fetch"
import type { ICliente } from "../types/cliente";
import type { IGenericResponse } from "../types/general";

export const getClientes = async (): Promise<ICliente[]> => {
    return await fetchSinToken('cliente', undefined, 'GET');
}

export const createCliente = async (cliente: ICliente): Promise<IGenericResponse> => {
    return await fetchSinToken('cliente', cliente, 'POST');
}

export const updateCliente = async (cliente: ICliente, clienteId: string): Promise<IGenericResponse> => {
    return await fetchSinToken(`cliente/${clienteId}`, cliente, 'PUT');
}

export const deleteCliente = async (clienteId: string): Promise<IGenericResponse> => {
    return await fetchSinToken(`cliente/${clienteId}`, undefined, 'DELETE');
}