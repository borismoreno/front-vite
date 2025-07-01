import { useState, useEffect } from "react";
import { getClientes } from "../../api/clientes";
import { ClientesTable } from "../../components/clientes/ClientesTable"
import type { ICliente } from "../../types/cliente";

export const Clientes = () => {
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const fetchClientes = async () => {
        const response = await getClientes();
        setClientes(response);
    };
    useEffect(() => {
        fetchClientes();
    }, []);

    const onUpdateClientes = async () => {
        await fetchClientes();
    }
    return (
        <ClientesTable clientes={clientes} onUpdate={onUpdateClientes} />
    )
}
