import { fetchSinToken } from "../helpers/fetch"
import type { IDashboard } from "../types/dashboard";

export const getDashboardInfo = async (startDate?: string, endDate?: string): Promise<IDashboard> => {
    return await fetchSinToken(`dashboard/getDashboardInfo${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`, undefined, 'GET');
}