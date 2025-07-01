import type { ICliente } from "./cliente";

export interface IDashboardInfo {
    title: string;
    value: number;
    change: string;
    trend: 'up' | 'down';
    subtitle: string;
    color: string;
}

export interface IDashboard {
    metrics: IDashboardInfo[];
    clientes: ICliente[];
}