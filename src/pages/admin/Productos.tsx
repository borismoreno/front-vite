import { useEffect, useState } from "react"
import { ProductosTable } from "../../components/productos/ProductosTable"
import type { IProducto } from "../../types/producto"
import { getProductos } from "../../api/producto";
import { toast } from "react-toastify";
import { Loading } from "../../components/Loading";

export const Productos = () => {
    const [productos, setProductos] = useState<IProducto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const response = await getProductos();
            setProductos(response);
        } catch (error) {
            console.log(error);
            toast.error('Error al cargar los productos.')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductos();
    }, []);

    const onUpdateProductos = async () => {
        await fetchProductos();
    }

    return (
        <>
            {loading && <Loading text="Cargando Productos" size="lg" />}
            <ProductosTable productos={productos} onUpdate={onUpdateProductos} />
        </>
    )
}
