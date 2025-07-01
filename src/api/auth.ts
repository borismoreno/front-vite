import { fetchSinToken } from "../helpers/fetch"
import type { ILoginRequest, ILoginResponse } from "../types/auth";

export const login = async (request: ILoginRequest): Promise<ILoginResponse> => {
    return await fetchSinToken('auth/login', request, 'POST');
}