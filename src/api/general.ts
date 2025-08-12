import { fetchSinToken } from "../helpers/fetch";
import type { ITarifaIva, ITipoFormaPago, ITipoIdentificacion, ITipoProducto } from "../types/general";

export const getTiposIdentificacion = async (): Promise<ITipoIdentificacion[]> => {
    return await fetchSinToken('general/tipo-identificacion', undefined, 'GET');
}

export const getTiposProducto = async (): Promise<ITipoProducto[]> => {
    return await fetchSinToken('general/tipo-producto', undefined, 'GET');
}

export const getTarifasIva = async (): Promise<ITarifaIva[]> => {
    return await fetchSinToken('general/tarifa-iva', undefined, 'GET');
}

export const getTiposFormaPago = async (): Promise<ITipoFormaPago[]> => {
    return await fetchSinToken('general/tipo-formaPago', undefined, 'GET');
}