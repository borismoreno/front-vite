import type { IProducto } from "../types/producto";
import { fetchSinToken } from "../helpers/fetch";
import type { IGenericResponse } from "../types/general";

export const getProductos = async (): Promise<IProducto[]> => {
    return await fetchSinToken('producto', undefined, 'GET');
}

export const createProducto = async (producto: IProducto): Promise<IGenericResponse> => {
    return await fetchSinToken('producto', producto, 'POST');
}

export const updateProducto = async (producto: IProducto, productoId: string): Promise<IGenericResponse> => {
    return await fetchSinToken(`producto/${productoId}`, producto, 'PUT');
}

export const deleteProduct = async (productoId: string): Promise<IGenericResponse> => {
    return await fetchSinToken(`producto/${productoId}`, undefined, 'DELETE');
}