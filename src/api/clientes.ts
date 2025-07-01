import { fetchSinToken } from "../helpers/fetch"
import type { ICliente } from "../types/cliente";

export const getClientes = async (): Promise<ICliente[]> => {
    return await fetchSinToken('cliente', undefined, 'GET');
}

export const createCliente = async (cliente: ICliente): Promise<ICliente> => {
    return await fetchSinToken('cliente', cliente, 'POST');
}

export const updateCliente = async (cliente: ICliente, clienteId: string): Promise<ICliente> => {
    return await fetchSinToken(`cliente/${clienteId}`, cliente, 'PUT');
}