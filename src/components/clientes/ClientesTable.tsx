import { useEffect, useRef, useState } from "react";
import type { ICliente } from "../../types/cliente";
import { AlertTriangle, MapPin, ChevronDown, ChevronLeft, ChevronRight, Edit, IdCardIcon, Mail, MoreHorizontal, Phone, PlusCircle, Search, Trash2, X } from "lucide-react";
import { CreateClientForm } from "./CreateClienteForm";
import { createCliente, deleteCliente, updateCliente } from "../../api/clientes";
import { toast } from 'react-toastify';

interface ClientesTableProps {
    clientes: ICliente[];
    onUpdate: () => void
}

export const ClientesTable = ({ clientes, onUpdate }: ClientesTableProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showCreateClientForm, setShowCreateClientForm] = useState(false);
    const [editingClient, setEditingClient] = useState<ICliente | null>(null);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const dropdownRefs = useRef<{
        [key: string]: HTMLDivElement | null;
    }>({});
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [goToPage, setGoToPage] = useState('')

    const filteredClients = clientes && clientes.filter(client => client.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) || client.mail && client.mail.toLowerCase().includes(searchQuery.toLowerCase()) || client.numeroIdentificacion.toLowerCase().includes(searchQuery.toLowerCase()));

    // Calculate pagination
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
    const indexOfLastClient = currentPage * itemsPerPage
    const indexOfFirstClient = indexOfLastClient - itemsPerPage
    const currentClients = filteredClients.slice(
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

    const handleCreateClientClick = () => {
        setEditingClient(null);
        setShowCreateClientForm(true);
    };
    const handleCancelCreateClient = () => {
        setShowCreateClientForm(false)
        setEditingClient(null)
    }
    // Cancel delete client
    const cancelDeleteClient = () => {
        setClientToDelete(null)
        setShowDeleteConfirmation(false)
    }
    const confirmDeleteClient = async () => {
        if (!clientToDelete) {
            toast.error('No se ha seleccionado un cliente para eliminar.');
            return;
        }
        try {
            const response = await deleteCliente(clientToDelete);
            if (response.success) {
                toast.success('Cliente eliminado correctamente.');
                onUpdate();
            } else {
                if (response.message) toast.error(response.message);
                else toast.error('Error al eliminar el cliente.')
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al eliminar el cliente.')
        } finally {
            setClientToDelete(null);
            setShowDeleteConfirmation(false);
        }
    }

    const handleCreateClientSubmit = async (clientData: ICliente) => {
        try {
            if (editingClient) {
                // Update existing client
                const response = await updateCliente(clientData, editingClient._id!);
                if (response.success) {
                    toast.success(`Cliente actualizado correctamente`);
                    onUpdate();
                } else {
                    if (response.message) toast.error(response.message);
                    else toast.error('Error al actualizar el cliente.')
                }
            } else {
                // Create new client
                const response = await createCliente(clientData);
                if (response.success) {
                    toast.success(`Cliente guardado correctamente`);
                    onUpdate();
                } else {
                    if (response.message) toast.error(response.message);
                    else toast.error('Error al guardar el cliente.')
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(`Error al ${editingClient ? 'actualizar' : 'guardar'} el cliente. Por favor, inténtalo de nuevo.`);
        } finally {
            // Reset form state
            setShowCreateClientForm(false)
            setEditingClient(null)
        }
    }
    const handleEditClient = (client: ICliente, e: any) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setEditingClient(client);
        setShowCreateClientForm(true);
        setActiveDropdown(null);
    };
    const toggleDropdown = (clientId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setActiveDropdown(activeDropdown === clientId ? null : clientId);
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
    // Check if a client is in the last two rows
    const isInLastTwoRows = (index: number) => {
        return index >= currentClients.length - 2
    }
    const showDeleteConfirmationDialog = (clientId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setClientToDelete(clientId);
        setShowDeleteConfirmation(true);
        setActiveDropdown(null);
    };

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
        <main className="flex-1 p-6">
            {showCreateClientForm ? (
                <div className="relative">
                    <button
                        onClick={handleCancelCreateClient}
                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <CreateClientForm
                        onCancel={handleCancelCreateClient}
                        onSubmit={handleCreateClientSubmit}
                        initialData={editingClient}
                        isEditing={!!editingClient}
                    />
                </div>
            ) : (<>
                {/* Delete Confirmation Dialog */}
                {showDeleteConfirmation && (
                    <div className="fixed inset-0 bg-black/30 bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
                            <div className="flex items-center mb-4 text-amber-600">
                                <AlertTriangle className="h-6 w-6 mr-2" />
                                <h3 className="text-lg font-semibold">Confirmar</h3>
                            </div>
                            <p className="mb-6 text-gray-600">
                                ¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cancelDeleteClient}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDeleteClient}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
                    <p className="text-gray-600">Administra la información de tus clientes</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="w-full sm:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input type="text" placeholder="Buscar cliente..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" />
                            </div>
                        </div>
                        <button onClick={handleCreateClientClick} className="w-full sm:w-auto py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Agregar Cliente
                        </button>
                    </div>
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teléfono
                                    </th>
                                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dirección
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentClients.map((client, index) => <tr key={client.numeroIdentificacion} className="hover:bg-gray-50">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full flex-shrink-0" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.razonSocial)}&background=random`} alt={client.razonSocial} />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {client.razonSocial}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {client.numeroIdentificacion}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {client.mail}
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                            {client.telefono}
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {client.direccion}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative" ref={el => { dropdownRefs.current[client.numeroIdentificacion] = el; }}>
                                            <button className="text-gray-400 hover:text-gray-600" onClick={e => toggleDropdown(client.numeroIdentificacion, e)}>
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                            {activeDropdown === client.numeroIdentificacion && (<div className={`absolute ${isInLastTwoRows(index) ? 'bottom-full' : 'top-full mt-2'} right-0 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200`}>
                                                <div className="py-1">
                                                    <button onClick={(e) => handleEditClient(client, e)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                                        Editar
                                                    </button>
                                                    <button onClick={e => showDeleteConfirmationDialog(client._id!, e)} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>)}
                                        </div>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile list view - Only shown on small screens */}
                    <div className="sm:hidden">
                        {currentClients.map((client) => (
                            <div key={client.numeroIdentificacion} className="border-b border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            className="h-10 w-10 rounded-full flex-shrink-0"
                                            src={
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(client.razonSocial)}&background=random`
                                            }
                                            alt={client.razonSocial}
                                        />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {client.razonSocial}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="relative"
                                        ref={el => { dropdownRefs.current[client.numeroIdentificacion] = el; }}
                                    >
                                        <button
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                            onClick={(e) => toggleDropdown(client.numeroIdentificacion, e)}
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                        {activeDropdown === client.numeroIdentificacion && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                <div className="py-1">
                                                    <button
                                                        onClick={(e) => handleEditClient(client, e)}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={(e) =>
                                                            showDeleteConfirmationDialog(client._id!, e)
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
                                    <div className="flex items-center text-sm text-gray-500">
                                        <IdCardIcon className="h-4 w-4 mr-2 text-gray-400" />
                                        {client.numeroIdentificacion}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        {client.mail}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        {client.telefono}
                                    </div>
                                    {client.direccion && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                            {client.direccion}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <div className="text-sm text-gray-700">
                                Mostrando {indexOfFirstClient + 1}-
                                {Math.min(indexOfLastClient, filteredClients.length)} de{' '}
                                {filteredClients.length} clientes
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
            </>)}
        </main>
    )
}
