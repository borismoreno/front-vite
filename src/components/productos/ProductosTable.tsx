import { useEffect, useRef, useState } from "react";
import type { IProducto } from "../../types/producto"
import { X, AlertTriangle, Search, PlusCircle, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, ChevronDown, Tag, PackageSearch, DiamondPercent, DollarSign } from "lucide-react";
import { CreateProductoForm } from "./CreateProductoForm";
import { createProducto, deleteProduct, updateProducto } from "../../api/producto";
import { toast } from "react-toastify";
import { Loading } from "../Loading";

interface IProductosTableProps {
    productos: IProducto[];
    onUpdate: () => void;
}

export const ProductosTable = ({ productos, onUpdate }: IProductosTableProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [showCreateProductForm, setShowCreateProductForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProducto | null>(null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [loaderMessage, setLoaderMessage] = useState<string>('Cargando');
    const dropdownRefs = useRef<{
        [key: string]: HTMLDivElement | null
    }>({});
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [goToPage, setGoToPage] = useState('')

    // Confirmation dialog state
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)

    // Filter products based on search query
    const filteredProducts = productos.filter(
        (product) =>
            product.codigoPrincipal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const indexOfLastClient = currentPage * itemsPerPage
    const indexOfFirstClient = indexOfLastClient - itemsPerPage
    const currentProducts = filteredProducts.slice(
        indexOfFirstClient,
        indexOfLastClient,
    )
    // Reset to first page when changing items per page
    useEffect(() => {
        setCurrentPage(1)
    }, [itemsPerPage])
    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                activeDropdown &&
                dropdownRefs.current[activeDropdown] &&
                !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)
            ) {
                setActiveDropdown(null)
            }
        }
        if (activeDropdown) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [activeDropdown])

    const handleCreateProductClick = () => {
        setEditingProduct(null)
        setShowCreateProductForm(true)
    }

    const handleCancelCreateProduct = () => {
        setShowCreateProductForm(false)
        setEditingProduct(null)
    }

    // Check if a product is in the last two rows
    const isInLastTwoRows = (index: number) => {
        return index >= currentProducts.length - 2
    }

    // Check if a product is in the first row
    const isInFirstRow = (index: number) => {
        return index === 0
    }

    const handleEditProduct = (product: IProducto, e: any) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setEditingProduct(product);
        setShowCreateProductForm(true);
        setActiveDropdown(null);
    };

    const showDeleteConfirmationDialog = (productId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setProductToDelete(productId);
        setShowDeleteConfirmation(true);
        setActiveDropdown(null);
    };

    const cancelDeleteProduct = () => {
        setProductToDelete(null)
        setShowDeleteConfirmation(false)
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) {
            toast.error('No se ha seleccionado un producto para eliminar.');
            return;
        }
        try {
            setLoaderMessage('Eliminando Producto');
            setLoading(true);
            const response = await deleteProduct(productToDelete);
            if (response.success) {
                toast.success('Producto eliminado correctamente.');
                onUpdate();
            } else {
                if (response.message) toast.error(response.message);
                else toast.error('Error al eliminar el producto')
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al eliminar el producto.')
        } finally {
            setLoading(false);
            setProductToDelete(null);
            setShowDeleteConfirmation(false);
        }
    };

    const handleCreateProductSubmit = async (productData: IProducto) => {
        try {
            setLoading(true);
            if (editingProduct) {
                setLoaderMessage('Actualizando producto');
                // Update existing product
                const response = await updateProducto(productData, editingProduct.id!);
                if (response.success) {
                    toast.success(`Producto actualizado correctamente`);
                    onUpdate();
                } else {
                    if (response.message) toast.error(response.message);
                    else toast.error('Error al actualizar el producto.')
                }
            } else {
                setLoaderMessage('Creando producto');
                // Create new product
                const response = await createProducto(productData);
                if (response.success) {
                    // Reset form state
                    setShowCreateProductForm(false)
                    setEditingProduct(null)
                    toast.success(`Producto guardado correctamente`);
                    onUpdate();
                } else {
                    if (response.message) toast.error(response.message);
                    else toast.error('Error al guardar el producto.')
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(`Error al ${editingProduct ? 'actualizar' : 'guardar'} el producto. Por favor, inténtalo de nuevo.`);
        } finally {
            setLoading(false);
        }

    }

    const toggleDropdown = (productId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setActiveDropdown(activeDropdown === productId ? null : productId);
    };

    // Pagination handlers
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }
    const handleItemsPerPageChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setItemsPerPage(Number(e.target.value))
    }
    const handleGoToPage = () => {
        const page = parseInt(goToPage)
        if (!isNaN(page) && page > 0 && page <= totalPages) {
            setCurrentPage(page)
            setGoToPage('')
        }
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = []
        // Always show first page
        pageNumbers.push(1)
        // Add current page and surrounding pages
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (!pageNumbers.includes(i)) {
                pageNumbers.push(i)
            }
        }
        // Add last page if there are more than 1 page
        if (totalPages > 1) {
            pageNumbers.push(totalPages)
        }
        // Sort and add ellipsis where needed
        const sortedPageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b)
        const result = []
        for (let i = 0; i < sortedPageNumbers.length; i++) {
            if (i > 0 && sortedPageNumbers[i] - sortedPageNumbers[i - 1] > 1) {
                result.push('ellipsis' + i)
            }
            result.push(sortedPageNumbers[i])
        }
        return result
    }

    return (
        <>
            {loading && <Loading text={loaderMessage} size="lg" />}
            <main className="flex-1 p-6">
                {showCreateProductForm ? (
                    <div className="relative">
                        <button
                            onClick={handleCancelCreateProduct}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <CreateProductoForm
                            onCancel={handleCancelCreateProduct}
                            onSubmit={handleCreateProductSubmit}
                            initialData={editingProduct}
                            isEditing={!!editingProduct}
                        />
                    </div>
                ) : (
                    <>
                        {/* Delete Confirmation Dialog */}
                        {showDeleteConfirmation && (
                            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
                                    <div className="flex items-center mb-4 text-amber-600">
                                        <AlertTriangle className="h-6 w-6 mr-2" />
                                        <h3 className="text-lg font-semibold">Confirmar</h3>
                                    </div>
                                    <p className="mb-6 text-gray-600">
                                        ¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.
                                    </p>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={cancelDeleteProduct}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={confirmDeleteProduct}
                                            disabled={loading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
                            <p className="text-gray-600">Administra tus productos y servicios</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="w-full sm:w-auto">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Buscar producto..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreateProductClick}
                                    className="w-full sm:w-auto py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Agregar Producto
                                </button>
                            </div>
                            {/* Table */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código Principal
                                            </th>
                                            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descripción
                                            </th>
                                            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo Producto
                                            </th>
                                            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tarifa Iva
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Valor Unitario
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentProducts.map((product, index) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.codigoPrincipal}
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 max-w-1/3 w-full">
                                                    {product.descripcion}
                                                </td>
                                                <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {product.tipoProductoDescripcion?.toLocaleLowerCase() ?? ''}
                                                </td>
                                                <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {product.tarifaIvaDescripcion?.toLocaleLowerCase() ?? ''}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${product.valorUnitario.toFixed(2)}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div
                                                        className="relative"
                                                        ref={(el) => { dropdownRefs.current[product.id!] = el; }}
                                                    >
                                                        <button
                                                            className="text-gray-400 hover:text-gray-600"
                                                            onClick={e => toggleDropdown(product.id!, e)}
                                                        >
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </button>
                                                        {activeDropdown === product.id && (
                                                            <div
                                                                className={`absolute ${!isInFirstRow(index) && isInLastTwoRows(index) ? 'bottom-full' : `top-full ${isInFirstRow(index) ? 'mt-[-15px]' : 'mt-2'}`} right-0 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200`}
                                                            >
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={(e) => handleEditProduct(product, e)}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                                                        Editar
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => showDeleteConfirmationDialog(product.id!, e)}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                                        Eliminar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Mobile list view - Only shown on small screens */}
                            <div className="sm:hidden">
                                {currentProducts.map(product => (
                                    <div key={product.id} className="border-b border-gray-200 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.descripcion}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="relative"
                                                ref={el => { dropdownRefs.current[product.id!] = el; }}
                                            >
                                                <button
                                                    className="text-gray-400 hover:text-gray-600 p-1"
                                                    onClick={(e) => toggleDropdown(product.id!, e)}
                                                >
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                                {activeDropdown === product.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => handleEditProduct(product, e)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={(e) =>
                                                                    showDeleteConfirmationDialog(product.id!, e)
                                                                }
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            {product.codigoPrincipal && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                                                    {product.codigoPrincipal}
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-500 capitalize">
                                                <PackageSearch className="h-4 w-4 mr-2 text-gray-400" />
                                                {product.tipoProductoDescripcion?.toLocaleLowerCase()}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 capitalize">
                                                <DiamondPercent className="h-4 w-4 mr-2 text-gray-400" />
                                                {product.tarifaIvaDescripcion?.toLocaleLowerCase()}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                                {product.valorUnitario.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                                <div className="flex items-center space-x-3 w-full sm:w-auto">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {indexOfFirstClient + 1}-
                                        {Math.min(indexOfLastClient, filteredProducts.length)} de{' '}
                                        {filteredProducts.length} productos
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className="appearance-none pl-3 pr-8 py-1 border border-gray-300 rounded text-sm bg-white text-gray-700"
                                        >
                                            <option value={5}>5 por página</option>
                                            <option value={10}>10 por página</option>
                                            <option value={20}>20 por página</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {getPageNumbers().map((page, index) =>
                                        typeof page === 'string' ? (
                                            <span key={page} className="px-2 text-gray-400">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(page as number)}
                                                className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                {page}
                                            </button>
                                        ),
                                    )}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <div className="hidden sm:flex items-center space-x-2 ml-4">
                                        <span className="text-sm text-gray-700">Ir a página</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max={totalPages}
                                            value={goToPage}
                                            onChange={(e) => setGoToPage(e.target.value)}
                                            className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleGoToPage()
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={handleGoToPage}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                                        >
                                            Ir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}