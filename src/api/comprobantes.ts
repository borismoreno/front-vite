import { fetchSinToken } from "../helpers/fetch";
import type { IFacturaEmitida } from "../types/comprobante";

export type SearchType = 'currentMonth' | 'previousMonth' | 'currentYear' | 'previousYear' | 'custom';

export const getFacturasEmitidas = async (searchType: SearchType, startDate?: Date, endDate?: Date): Promise<IFacturaEmitida[]> => {
    return await fetchSinToken(`comprobante/facturas-emitidas?searchType=${searchType}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`);
}

export const simularEnvio = async (clienteId: string): Promise<any> => {
    return await fetchSinToken(`comprobante/simular-emision`, { "connectionId": clienteId }, 'POST');
}