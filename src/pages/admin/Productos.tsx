import { useEffect, useState } from "react"
import { ProductosTable } from "../../components/productos/ProductosTable"
import type { IProducto } from "../../types/producto"
import { getProductos } from "../../api/producto";

export const Productos = () => {
    const [productos, setProductos] = useState<IProducto[]>([]);

    const fetchProductos = async () => {
        const response = await getProductos();
        setProductos(response);
    }

    useEffect(() => {
        fetchProductos();
    }, []);

    const onUpdateProductos = async () => {
        await fetchProductos();
    }

    return (
        <ProductosTable productos={productos} onUpdate={onUpdateProductos} />
    )
}
