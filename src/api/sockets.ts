import { fetchSinToken } from "../helpers/fetch";
import type { IGenericResponse } from "../types/general";

export const saveConnectionId = async (connectionId: string): Promise<IGenericResponse> => {
    return await fetchSinToken('sockets', { connectionId }, 'POST');
}

export const deleteConnectionId = async (): Promise<IGenericResponse> => {
    return await fetchSinToken('sockets', undefined, 'DELETE');
}