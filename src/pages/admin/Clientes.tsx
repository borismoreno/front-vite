import { useState, useEffect } from "react";
import { getClientes } from "../../api/clientes";
import { ClientesTable } from "../../components/clientes/ClientesTable"
import type { ICliente } from "../../types/cliente";
import { toast } from "react-toastify";
import { Loading } from "../../components/Loading";

export const Clientes = () => {
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const response = await getClientes();
            setClientes(response);
        } catch (error) {
            console.log(error);
            toast.error('Error cargando los clientes.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClientes();
    }, []);

    const onUpdateClientes = async () => {
        await fetchClientes();
    }
    return (
        <>
            {loading && <Loading text="Cargando Clientes" size="lg" />}
            <ClientesTable clientes={clientes} onUpdate={onUpdateClientes} />
        </>
    )
}
