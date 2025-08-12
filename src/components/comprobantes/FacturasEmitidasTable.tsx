import { useEffect, useRef, useState } from "react";
import type { IFacturaEmitida } from "../../types/comprobante"
import { Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, DollarSign, IdCardIcon, MoreHorizontal, PlusCircle, Search, TableOfContents, X } from "lucide-react";
import type { SearchType } from "../../api/comprobantes";
import { NuevaFacturaForm } from "./NuevaFactura";

interface IFacturasEmitidasTableProps {
    facturasEmitidas: IFacturaEmitida[];
    onDateChanged?: (dateOption: SearchType, startDate?: Date, endDate?: Date) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Procesada':
            return 'bg-green-100 text-green-800'
        case 'Autorizada':
            return 'bg-yellow-100 text-yellow-800'
        case 'Por Procesar':
            return 'bg-blue-100 text-blue-800'
        case 'No Autorizada':
        case 'Devuelta':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export const FacturasEmitidasTable = ({ facturasEmitidas, onDateChanged }: IFacturasEmitidasTableProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [goToPage, setGoToPage] = useState('')

    const [dateRangeOption, setDateRangeOption] = useState<SearchType>('currentMonth')
    const [customStartDate, setCustomStartDate] = useState<string>('')
    const [customEndDate, setCustomEndDate] = useState<string>('')
    const [showCustomDateInputs, setShowCustomDateInputs] = useState(false)
    const calendarDropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        onDateChanged && dateRangeOption !== 'custom' && onDateChanged(
            dateRangeOption
        );
    }, [dateRangeOption]);
    // Handle clicking outside of dropdowns
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                calendarDropdownRef.current &&
                !calendarDropdownRef.current.contains(event.target as Node)
            ) {
                setIsCalendarOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const filteredFacturas = facturasEmitidas && facturasEmitidas.filter(factura => factura.razonSocialCliente.toLowerCase().includes(searchQuery.toLowerCase()) || factura.identificacionCliente && factura.identificacionCliente.toLowerCase().includes(searchQuery.toLowerCase()) || factura.numeroFactura.toLowerCase().includes(searchQuery.toLowerCase()));

    // Calculate pagination
    const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage)
    const indexOfLastFactura = currentPage * itemsPerPage
    const indexOfFirstFactura = indexOfLastFactura - itemsPerPage
    const currentFacturas = filteredFacturas.slice(
        indexOfFirstFactura,
        indexOfLastFactura,
    )
    // Reset to first page when changing items per page
    useEffect(() => {
        setCurrentPage(1)
    }, [itemsPerPage])
    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])

    // Check if a factura is in the last two rows
    // const isInLastTwoRows = (index: number) => {
    //     return index >= currentFacturas.length - 2
    // }

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen)
    }

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

    const handleCreateFacturaClick = () => {
        setShowInvoiceForm(true);
    };

    const handleDateRangeSelect = (option: SearchType) => {
        setDateRangeOption(option)
        setShowCustomDateInputs(option === 'custom')
        if (option !== 'custom') {
            setIsCalendarOpen(false)
        }
    }
    const handleCustomDateSubmit = () => {
        if (customStartDate && customEndDate) {
            console.log(customEndDate, customEndDate);
            onDateChanged && onDateChanged(
                'custom', new Date(customStartDate), new Date(customEndDate)
            )
            setIsCalendarOpen(false)
        }
    }
    // Get display text for the selected date range
    const getDateRangeDisplayText = (): string => {
        switch (dateRangeOption) {
            case 'currentMonth':
                return 'Mes Actual'
            case 'previousMonth':
                return 'Mes Anterior'
            case 'currentYear':
                return 'Año Actual'
            case 'previousYear':
                return 'Año Anterior'
            case 'custom':
                return customStartDate && customEndDate
                    ? `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`
                    : 'Rango Específico'
            default:
                return 'Mes Actual'
        }
    }
    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-EC', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const handleCancelInvoice = () => {
        setShowInvoiceForm(false)
    }

    return <main className={`flex-1 ${showInvoiceForm ? 'p-2' : 'p-6'}`}>
        {showInvoiceForm ? <div className="relative">
            <button
                onClick={handleCancelInvoice}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
            >
                <X className="h-5 w-5" />
            </button>
            <NuevaFacturaForm onCancel={handleCancelInvoice} />
        </div> : (<>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Facturas</h1>
                <p className="text-gray-600">Administra tus facturas</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input type="text" placeholder="Buscar factura..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" />
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <div className="block relative" ref={calendarDropdownRef}>
                            <button
                                onClick={toggleCalendar}
                                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">{getDateRangeDisplayText()}</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${isCalendarOpen ? 'transform rotate-180' : ''}`}
                                />
                            </button>
                            {/* Calendar Dropdown */}
                            {isCalendarOpen && (
                                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                                    <button
                                        onClick={() => handleDateRangeSelect('currentMonth')}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>Mes Actual</span>
                                        {dateRangeOption === 'currentMonth' && (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDateRangeSelect('previousMonth')}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>Mes Anterior</span>
                                        {dateRangeOption === 'previousMonth' && (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDateRangeSelect('currentYear')}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>Año Actual</span>
                                        {dateRangeOption === 'currentYear' && (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDateRangeSelect('previousYear')}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>Año Anterior</span>
                                        {dateRangeOption === 'previousYear' && (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDateRangeSelect('custom')}
                                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>Rango Específico</span>
                                        {dateRangeOption === 'custom' && (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        )}
                                    </button>
                                    {/* Custom Date Range Inputs */}
                                    {showCustomDateInputs && (
                                        <div className="px-4 py-2 border-t border-gray-200 mt-1">
                                            <div className="mb-2">
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={customStartDate}
                                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="block text-xs text-gray-500 mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={customEndDate}
                                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <button
                                                onClick={handleCustomDateSubmit}
                                                disabled={!customStartDate || !customEndDate}
                                                className="w-full mt-1 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <button onClick={handleCreateFacturaClick} className="w-full sm:w-auto py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Agregar Factura
                    </button>
                </div>
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    # Factura
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Emisión
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentFacturas.map((factura) => <tr key={factura.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {factura.numeroFactura}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full flex-shrink-0" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(factura.razonSocialCliente)}&background=random`} alt={factura.razonSocialCliente} />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {factura.razonSocialCliente}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {factura.identificacionCliente}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {factura.fechaEmision}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(factura.estadoComprobante)}`}
                                    >
                                        {factura.estadoComprobante}
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {`$${factura.importeTotal.toFixed(2)}`}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                {/* Mobile list view - Only shown on small screens */}
                <div className="sm:hidden">
                    {currentFacturas.map((factura) => (
                        <div key={factura.id} className="border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img
                                        className="h-10 w-10 rounded-full flex-shrink-0"
                                        src={
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(factura.razonSocialCliente)}&background=random`
                                        }
                                        alt={factura.razonSocialCliente}
                                    />
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                            {factura.razonSocialCliente}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                    // onClick={(e) => toggleDropdown(client.numeroIdentificacion, e)}
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-gray-500">
                                    <IdCardIcon className="h-4 w-4 mr-2 text-gray-400" />
                                    {factura.identificacionCliente}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <TableOfContents className="h-4 w-4 mr-2 text-gray-400" />
                                    {factura.numeroFactura}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {factura.fechaEmision}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                    {factura.importeTotal.toFixed(2)}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(factura.estadoComprobante)}`}
                                    >
                                        {factura.estadoComprobante}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <div className="text-sm text-gray-700">
                            Mostrando {indexOfFirstFactura + 1}-
                            {Math.min(indexOfLastFactura, filteredFacturas.length)} de{' '}
                            {filteredFacturas.length} facturas
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
}