import { fetchSinToken } from "../helpers/fetch"
import type { ISettings } from "../types/settings";

export const getSettings = async (): Promise<ISettings> => {
    return await fetchSinToken('empresa', undefined, 'GET');
}