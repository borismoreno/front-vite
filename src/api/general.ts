import { fetchSinToken } from "../helpers/fetch";
import type { ITipoIdentificacion } from "../types/general";

export const getTiposIdentificacion = async (): Promise<ITipoIdentificacion[]> => {
    return await fetchSinToken('general/tipo-identificacion', undefined, 'GET');
}