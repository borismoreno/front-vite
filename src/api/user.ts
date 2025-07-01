import { fetchSinToken } from "../helpers/fetch"
import type { IGenericResponse } from "../types/general";
import type { IRegisterRequest } from "../types/user";

export const registerUser = async (request: IRegisterRequest): Promise<IGenericResponse> => {
    return await fetchSinToken('user', request, 'POST');
}