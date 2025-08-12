import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Check, ChevronDown, DollarSign, Percent, PlusCircle, Search, Trash2, UserPlus, Users, X, Save, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ICliente } from "../../types/cliente";
import type { IProducto } from "../../types/producto";
import { createCliente, getClientes } from "../../api/clientes";
import { createProducto, getProductos } from "../../api/producto";
import { toast } from "react-toastify";
import { CreateClientForm } from "../clientes/CreateClienteForm";
import { CreateProductoForm } from "../productos/CreateProductoForm";
import { Loading } from "../Loading";
import type { ITipoFormaPago } from "../../types/general";
import { getTiposFormaPago } from "../../api/general";

const schema = yup.object({
    clienteId: yup.string().required("El cliente es obligatorio"),
    tipoFormaPago: yup.string().required("El tipo de forma de pago es obligatorio")
}).required();

type FormData = yup.InferType<typeof schema>;

interface AdditionalInfoItem {
    info: string
    value: string
};

interface InvoiceItem {
    id?: string;
    description: string
    quantity: number
    rate: number
    discountType: 'percentage' | 'amount'
    discountValue: number
    taxRate: number // 0 or 15
    amount: number
}

interface INuevaFacturaFormProps {
    onCancel: () => void;
}

export const NuevaFacturaForm = ({ onCancel }: INuevaFacturaFormProps) => {
    const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState<boolean>(false);
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loaderMessage, setLoaderMessage] = useState<string>('Cargando');
    const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedTipoFormaPago, setSelectedTipoFormaPago] = useState<string>('')
    const [isTipoFormaPagoDropdownOpen, setIsTipoFormaPagoDropdownOpen] = useState<boolean>(false);
    const clientDropdownRef = useRef<HTMLDivElement>(null);
    const tipoFormaPagoDropdownRef = useRef<HTMLDivElement>(null)
    const productDropdownRefs = useRef<{
        [key: number]: HTMLDivElement | null
    }>({})
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoItem[]>([
        {
            info: '',
            value: '',
        },
    ])
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [productos, setProductos] = useState<IProducto[]>([]);
    const [tiposFormaPago, setTiposFormaPago] = useState<ITipoFormaPago[]>([]);
    const [activeProductSearchIndex, setActiveProductSearchIndex] = useState<number | null>(null)
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false)
    const [activeProductItemIndex, setActiveProductItemIndex] = useState<number | null>(null)

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            clienteId: '',
            tipoFormaPago: ''
        }
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        {
            description: '',
            quantity: 1,
            rate: 0,
            discountType: 'percentage',
            discountValue: 0,
            taxRate: 0,
            amount: 0,
        },
    ])

    const fetchData = async () => {
        try {
            setLoading(true);
            setLoaderMessage('Cargando datos de clientes y productos');
            const [clientesRes, productosRes, tiposFormaPagoRes] = await Promise.all([getClientes(), getProductos(), getTiposFormaPago()]);
            setClientes(clientesRes);
            setProductos(productosRes);
            setTiposFormaPago(tiposFormaPagoRes.map(tipo => ({
                codigo: tipo.codigo,
                formaPago: tipo.formaPago.toLocaleLowerCase()
            })));
        } catch (error) {
            console.log(error);
            toast.error('Error al cargar la data.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const toggleClientDropdown = () => {
        setIsClientDropdownOpen(!isClientDropdownOpen)
        if (!isClientDropdownOpen) {
            setClientSearchQuery('') // Clear search when opening dropdown
        }
    }

    const toggleTipoFormaPagoDropdown = () => {
        setIsTipoFormaPagoDropdownOpen(!isTipoFormaPagoDropdownOpen);
    }

    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.razonSocial.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
            String(cliente.numeroIdentificacion).toLowerCase().includes(clientSearchQuery.toLowerCase()),
    )
    // Limit displayed clients to first 5 if not searching
    const displayedClients = clientSearchQuery
        ? filteredClientes
        : filteredClientes.slice(0, 5)

    const selectClient = (clientId: string, clientName: string) => {
        // setSelectedClientId(clientId);
        setValue('clienteId', clientId);
        if (errors.clienteId) {
            delete errors.clienteId;
        }
        setSelectedClient(clientName)
        setIsClientDropdownOpen(false)
        setClientSearchQuery('')
    }
    const openCreateClientModal = () => {
        setIsCreateClientModalOpen(true)
        setIsClientDropdownOpen(false)
    }

    const handleCreateClientCancel = () => {
        setIsCreateClientModalOpen(false)
        setIsClientDropdownOpen(true) // Reopen the dropdown
    }

    const selectTipoFormaPago = (codigo: string, tipoFormaPago: string) => {
        setSelectedTipoFormaPago(tipoFormaPago);
        setIsTipoFormaPagoDropdownOpen(false);
        setValue('tipoFormaPago', codigo);
        if (errors.tipoFormaPago) {
            delete errors.tipoFormaPago;
        }
    }

    const handleCreateClientSubmit = async (clientData: ICliente) => {
        try {
            setLoading(true);
            setLoaderMessage('Creando cliente');
            // Create new client
            const response = await createCliente(clientData);
            if (response.success) {
                toast.success(`Cliente guardado correctamente`);
                fetchData();
                selectClient(clientData.numeroIdentificacion, clientData.razonSocial);
                setIsCreateClientModalOpen(false);
            } else {
                if (response.message) toast.error(response.message);
                else toast.error('Error al guardar el cliente.')
            }
        } catch (error) {
            console.log(error);
            toast.error(`Error al guardar el cliente. Por favor, inténtalo de nuevo.`);
        } finally {
            setLoading(false);
        }
    }

    const handleProductSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setProductSearchQuery(e.target.value)
    }

    const openCreateProductModal = (index: number) => {
        setActiveProductItemIndex(index)
        setIsCreateProductModalOpen(true)
        setActiveProductSearchIndex(null)
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }
    const updateItem = <K extends keyof InvoiceItem>(index: number, field: K, value: InvoiceItem[K]) => {
        const newItems = [...items]
        newItems[index][field] = value
        // Auto-calculate amount with discount and tax
        if (
            field === 'quantity' ||
            field === 'rate' ||
            field === 'discountType' ||
            field === 'discountValue' ||
            field === 'taxRate'
        ) {
            const item = newItems[index]
            const subtotal = item.quantity * item.rate
            // Calculate discount
            let discountAmount = 0
            if (item.discountType === 'percentage') {
                discountAmount = subtotal * (item.discountValue / 100)
            } else {
                discountAmount = item.discountValue
            }
            // Ensure discount doesn't exceed the subtotal
            discountAmount = Math.min(discountAmount, subtotal)
            // Calculate amount after discount but before tax
            const amountAfterDiscount = subtotal - discountAmount
            // Apply tax if applicable
            // const taxAmount = amountAfterDiscount * (item.taxRate / 100)
            // Final amount includes tax
            newItems[index].amount = amountAfterDiscount
            // newItems[index].amount = amountAfterDiscount + taxAmount
        }
        setItems(newItems)
    }
    // Calculate total tax amount
    const calculateTotalTax = () => {
        return items.reduce((total, item) => {
            const subtotal = item.quantity * item.rate
            // Calculate discount
            let discountAmount = 0
            if (item.discountType === 'percentage') {
                discountAmount = subtotal * (item.discountValue / 100)
            } else {
                discountAmount = item.discountValue
            }
            // Ensure discount doesn't exceed the subtotal
            discountAmount = Math.min(discountAmount, subtotal)
            // Calculate amount after discount but before tax
            const amountAfterDiscount = subtotal - discountAmount
            // Calculate tax
            const taxAmount = amountAfterDiscount * (item.taxRate / 100)
            return total + taxAmount
        }, 0)
    }
    const calculateTotal = () => {
        return (
            calculateSubtotal0Percent() +
            calculateSubtotal15Percent() +
            calculateTotalTax()
        )
    }

    const calculateSubtotalBeforeTaxes = () => {
        return items.reduce((total, item) => total + item.quantity * item.rate, 0)
    }
    const calculateSubtotal0Percent = () => {
        return items.reduce((total, item) => {
            if (item.taxRate === 0) {
                const subtotal = item.quantity * item.rate
                let discountAmount = 0
                if (item.discountType === 'percentage') {
                    discountAmount = subtotal * (item.discountValue / 100)
                } else {
                    discountAmount = item.discountValue
                }
                // Ensure discount doesn't exceed the subtotal
                discountAmount = Math.min(discountAmount, subtotal)
                return total + (subtotal - discountAmount)
            }
            return total
        }, 0)
    }
    const calculateSubtotal15Percent = () => {
        return items.reduce((total, item) => {
            if (item.taxRate === 15) {
                const subtotal = item.quantity * item.rate
                let discountAmount = 0
                if (item.discountType === 'percentage') {
                    discountAmount = subtotal * (item.discountValue / 100)
                } else {
                    discountAmount = item.discountValue
                }
                // Ensure discount doesn't exceed the subtotal
                discountAmount = Math.min(discountAmount, subtotal)
                return total + (subtotal - discountAmount)
            }
            return total
        }, 0)
    }

    const calculateTotalDiscount = () => {
        return items.reduce((total, item) => {
            const subtotal = item.quantity * item.rate
            let discountAmount = 0
            if (item.discountType === 'percentage') {
                discountAmount = subtotal * (item.discountValue / 100)
            } else {
                discountAmount = item.discountValue
            }
            // Ensure discount doesn't exceed the subtotal
            discountAmount = Math.min(discountAmount, subtotal)
            return total + discountAmount
        }, 0)
    }

    const handleProductSearchFocus = (index: number) => {
        // Close any other open dropdown first
        if (
            activeProductSearchIndex !== null &&
            activeProductSearchIndex !== index
        ) {
            setProductSearchQuery('')
        }
        setActiveProductSearchIndex(index)
    }

    // Improved product dropdown handling - separate refs for each item row
    const filteredProducts = productos.filter((product) => {
        if (!productSearchQuery) return true
        return (
            product.codigoPrincipal?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
            product.descripcion
                .toLowerCase()
                .includes(productSearchQuery.toLowerCase()) ||
            product.id?.toLowerCase().includes(productSearchQuery.toLowerCase())
        )
    })
    // Limit displayed products to first 5 if not searching
    const displayedProducts = productSearchQuery
        ? filteredProducts
        : filteredProducts.slice(0, 5)
    const addItem = () => {
        setItems([
            ...items,
            {
                description: '',
                quantity: 1,
                rate: 0,
                discountType: 'percentage',
                discountValue: 0,
                taxRate: 0,
                amount: 0,
            },
        ])
    }

    const selectProduct = (index: number, product: IProducto) => {
        // validate the selected product is not already in the list by its id
        if (items.some(item => item.id === product.id)) {
            toast.error('El producto ya está agregado en la factura.');
            return;
        }

        const newItems = [...items]
        newItems[index] = {
            ...newItems[index],
            id: product.id,
            description: product.descripcion,
            rate: product.valorUnitario,
            taxRate: isNaN(Number(product.tarifaIvaDescripcion?.slice(0, -1) ?? '')) ? 0 : Number(product.tarifaIvaDescripcion?.slice(0, -1) ?? ''),
            amount: newItems[index].quantity * product.valorUnitario,
            // Keep existing discount settings
            discountType: newItems[index].discountType,
            discountValue: newItems[index].discountValue,
        }
        // Recalculate amount with discount and tax
        const subtotal = newItems[index].quantity * newItems[index].rate
        // Calculate discount
        let discountAmount = 0
        if (newItems[index].discountType === 'percentage') {
            discountAmount = subtotal * (newItems[index].discountValue / 100)
        } else {
            discountAmount = newItems[index].discountValue
        }
        // Ensure discount doesn't exceed the subtotal
        discountAmount = Math.min(discountAmount, subtotal)
        // Calculate amount after discount but before tax
        const amountAfterDiscount = subtotal - discountAmount
        // Apply tax if applicable
        // const taxAmount = amountAfterDiscount * (newItems[index].taxRate / 100)
        // Final amount includes tax
        newItems[index].amount = amountAfterDiscount
        // newItems[index].amount = amountAfterDiscount + taxAmount
        setItems(newItems)
        setActiveProductSearchIndex(null)
        setProductSearchQuery('')
    }

    const handleCreateProductCancel = () => {
        setIsCreateProductModalOpen(false)
        if (activeProductItemIndex !== null) {
            setActiveProductSearchIndex(activeProductItemIndex)
        }
    }

    const handleCreateProductSubmit = async (productData: IProducto) => {
        try {
            setLoading(true);
            setLoaderMessage('Creando Producto');
            const response = await createProducto(productData);
            if (response.success) {
                const productoRes = response.data as IProducto;
                // seleccionar el producto si la respuesta es exitosa
                if (activeProductItemIndex !== null) {
                    selectProduct(activeProductItemIndex, productoRes);
                }
                fetchData();

                toast.success(`Producto guardado correctamente`);
                setIsCreateProductModalOpen(false);
            } else {
                if (response.message) toast.error(response.message);
                else toast.error('Error al guardar el producto.')
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    // Close client dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                clientDropdownRef.current &&
                !clientDropdownRef.current.contains(event.target as Node)
            ) {
                setIsClientDropdownOpen(false)
            }
        }
        // Only add the event listener if the dropdown is open
        if (isClientDropdownOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isClientDropdownOpen])

    // Close product dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (activeProductSearchIndex !== null) {
                const currentRef = productDropdownRefs.current[activeProductSearchIndex]
                if (currentRef && !currentRef.contains(event.target as Node)) {
                    setActiveProductSearchIndex(null)
                    setProductSearchQuery('')
                }
            }
        }
        if (activeProductSearchIndex !== null) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [activeProductSearchIndex])

    // Close tipo forma pago dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                tipoFormaPagoDropdownRef.current &&
                !tipoFormaPagoDropdownRef.current.contains(event.target as Node)
            ) {
                setIsTipoFormaPagoDropdownOpen(false)
            }
        }
        // Only add the event listener if the dropdown is open
        if (isTipoFormaPagoDropdownOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isTipoFormaPagoDropdownOpen])

    const onHandleSubmit = async (data: FormData) => {
        console.log('data', data);
        const filter = items.filter(it => it.id).length;
        if (filter < 1) {
            toast.error('Es necesario al menos un detalle para emitir la factura');
            return;
        }
    }

    const addAdditionalInfo = () => {
        setAdditionalInfo([
            ...additionalInfo,
            {
                info: '',
                value: '',
            },
        ])
    }
    const removeAdditionalInfo = (index: number) => {
        setAdditionalInfo(additionalInfo.filter((_, i) => i !== index))
    }
    const updateAdditionalInfo = (
        index: number,
        field: keyof AdditionalInfoItem,
        value: string,
    ) => {
        const newAdditionalInfo = [...additionalInfo]
        newAdditionalInfo[index][field] = value
        setAdditionalInfo(newAdditionalInfo)
    }

    return (
        <>
            {loading && <Loading text={loaderMessage} size="lg" />}
            <div className="flex flex-col w-full max-w-6xl mx-auto items-center justify-center p-2">
                {/* Create Client Modal */}
                {isCreateClientModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                            <button
                                onClick={handleCreateClientCancel}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <CreateClientForm
                                onCancel={handleCreateClientCancel}
                                onSubmit={handleCreateClientSubmit}
                            />
                        </div>
                    </div>
                )}
                {/* Create Product Modal */}
                {isCreateProductModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
                            <button
                                onClick={handleCreateProductCancel}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <CreateProductoForm
                                onCancel={handleCreateProductCancel}
                                onSubmit={handleCreateProductSubmit}
                            />
                        </div>
                    </div>
                )}
                <div className="w-full ">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                        Nueva Factura
                    </h1>
                    <form onSubmit={handleSubmit(onHandleSubmit)}>
                        <div className="space-y-6">
                            {/* Client and invoice details section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Client selection - Custom dropdown */}
                                <div className="relative" ref={clientDropdownRef}>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={toggleClientDropdown}
                                            className={`block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left ${selectedClient ? 'text-gray-900' : 'text-gray-400'}`}
                                        >
                                            {selectedClient || 'Seleccionar Cliente'}
                                        </button>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <ChevronDown
                                                className={`h-4 w-4 text-gray-400 transition-transform ${isClientDropdownOpen ? 'transform rotate-180' : ''}`}
                                            />
                                        </div>
                                        {isClientDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-90 overflow-auto">
                                                <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar por nombre o identificación..."
                                                            value={clientSearchQuery}
                                                            onChange={(e) =>
                                                                setClientSearchQuery(e.target.value)
                                                            }
                                                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                {filteredClientes.length > 0 ? (
                                                    displayedClients.map((client) => (
                                                        <div
                                                            key={client._id}
                                                            onClick={() => selectClient(client._id!, client.razonSocial)}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                        >
                                                            {selectedClient === client.razonSocial && (
                                                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                                            )}
                                                            <div>
                                                                <span
                                                                    className={
                                                                        selectedClient === client.razonSocial
                                                                            ? 'font-medium'
                                                                            : ''
                                                                    }
                                                                >
                                                                    {client.razonSocial}
                                                                </span>
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    ID: {client.numeroIdentificacion}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                        No clients found
                                                    </div>
                                                )}
                                                {!clientSearchQuery && filteredClientes.length > 5 && (
                                                    <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
                                                        {filteredClientes.length - 5} clientes disponibles.
                                                        Usa el buscardor para seleccionarlos.
                                                    </div>
                                                )}
                                                {/* Create New Client button */}
                                                <div className="sticky bottom-0 bg-white p-2 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={openCreateClientModal}
                                                        className="w-full py-2 px-4 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg flex items-center justify-center text-sm transition-colors"
                                                    >
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Crear Nuevo Cliente
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.clienteId && <p className="pl-4 text-red-500 text-xs">{errors.clienteId.message}</p>}
                                </div>
                                <div className="relative" ref={tipoFormaPagoDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={toggleTipoFormaPagoDropdown}
                                        className={`block w-full pl-10 pr-10 py-3 border capitalize border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left ${selectedTipoFormaPago ? 'text-gray-900' : 'text-gray-400'}`}
                                    >
                                        {selectedTipoFormaPago || 'Tipo Forma Pago'}
                                    </button>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform ${isTipoFormaPagoDropdownOpen ? 'transform rotate-180' : ''}`}
                                        />
                                    </div>
                                    {isTipoFormaPagoDropdownOpen && (
                                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                            {tiposFormaPago.map((tipo) => (
                                                <div
                                                    key={tipo.codigo}
                                                    onClick={() => selectTipoFormaPago(tipo.codigo, tipo.formaPago)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                >
                                                    {selectedTipoFormaPago === tipo.formaPago && (
                                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                                    )}
                                                    <div>
                                                        <span
                                                            className={
                                                                `capitalize ${selectedTipoFormaPago === tipo.formaPago
                                                                    ? 'font-medium'
                                                                    : ''}`
                                                            }
                                                        >
                                                            {tipo.formaPago.toLocaleLowerCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.tipoFormaPago && <p className="pl-4 text-red-500 text-xs">{errors.tipoFormaPago.message}</p>}
                                </div>
                            </div>
                            {/* Items section */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">
                                    Detalles
                                </h2>
                                {/* Table header - Responsive version */}
                                <div className="hidden md:grid md:grid-cols-12 md:gap-2 mb-2 text-sm font-medium text-gray-700 px-2">
                                    <div className="md:col-span-5">Descripción</div>
                                    <div className="md:col-span-1">Cantidad</div>
                                    <div className="md:col-span-2">Valor Unitario</div>
                                    <div className="md:col-span-2">Descuento</div>
                                    <div className="md:col-span-2">Valor Total</div>
                                </div>
                                {/* Invoice items - Responsive version */}
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="mb-6 md:mb-3 border border-gray-200 rounded-lg p-3 md:p-0 md:border-0"
                                    >
                                        {/* Mobile view item header */}
                                        <div className="flex justify-between items-center md:hidden mb-2">
                                            <div className="text-sm font-medium text-gray-700">
                                                Detalle #{index + 1}
                                            </div>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                    aria-label="Eliminar item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        {/* Responsive grid layout */}
                                        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-2 md:items-start">
                                            {/* Description field - Full width on mobile, col-span-4 on desktop */}
                                            <div
                                                className="md:col-span-5 relative"
                                                ref={(el) => { productDropdownRefs.current[index] = el; }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                    Descripción
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar producto por descripción"
                                                    value={
                                                        activeProductSearchIndex === index
                                                            ? productSearchQuery
                                                            : item.description
                                                    }
                                                    onChange={(e) =>
                                                        activeProductSearchIndex === index
                                                            ? handleProductSearchChange(e)
                                                            : updateItem(index, 'description', e.target.value)
                                                    }
                                                    onFocus={() => handleProductSearchFocus(index)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                // required
                                                />
                                                {activeProductSearchIndex === index && (
                                                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                                        <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                                                            <div className="text-sm font-medium text-gray-700">
                                                                Selecciona un producto
                                                            </div>
                                                        </div>
                                                        {displayedProducts.length > 0 ? (
                                                            displayedProducts.map((product) => (
                                                                <div
                                                                    key={product.id}
                                                                    onClick={() => selectProduct(index, product)}
                                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    <div className="font-medium">
                                                                        {product.codigoPrincipal}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {product.descripcion}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        Valor Unitario: ${product.valorUnitario.toFixed(2)}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                                Producto no encontrado
                                                            </div>
                                                        )}
                                                        {!productSearchQuery &&
                                                            filteredProducts.length > 5 && (
                                                                <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
                                                                    {filteredProducts.length - 5} productos mas disponibles. Usa el buscador para seleccionarlos
                                                                </div>
                                                            )}
                                                        {/* Create New Product button */}
                                                        <div className="sticky bottom-0 bg-white p-2 border-t border-gray-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => openCreateProductModal(index)}
                                                                className="w-full py-2 px-4 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-lg flex items-center justify-center text-sm transition-colors"
                                                            >
                                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                                Crear Nuevo Producto
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Quantity and Rate - Side by side on mobile, separate columns on desktop */}
                                            <div className="grid grid-cols-2 gap-2 md:gap-0 md:contents">
                                                <div className="md:col-span-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                        Cantidad
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'quantity',
                                                                parseInt(e.target.value) || 0,
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                        Valor Unitario
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                            <DollarSign className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.rate}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'rate',
                                                                    parseFloat(e.target.value) || 0,
                                                                )
                                                            }
                                                            className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Discount fields */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                    Descuento
                                                </label>
                                                <div className="flex rounded-lg overflow-hidden">
                                                    {/* Type selector */}
                                                    <div className="flex border border-gray-300 rounded-l-lg overflow-hidden">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateItem(index, 'discountType', 'percentage')
                                                            }
                                                            className={`px-2 py-2 text-xs font-medium flex items-center justify-center ${item.discountType === 'percentage' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                            aria-label="Percentage discount"
                                                        >
                                                            <Percent className="h-3 w-3 mr-1" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateItem(index, 'discountType', 'amount')
                                                            }
                                                            className={`px-2 py-2 text-xs font-medium flex items-center justify-center ${item.discountType === 'amount' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                            aria-label="Fixed amount discount"
                                                        >
                                                            <DollarSign className="h-3 w-3 mr-1" />
                                                        </button>
                                                    </div>
                                                    {/* Value input */}
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step={
                                                            item.discountType === 'percentage' ? '1' : '0.01'
                                                        }
                                                        max={
                                                            item.discountType === 'percentage'
                                                                ? '100'
                                                                : item.rate * item.quantity
                                                        }
                                                        value={item.discountValue}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'discountValue',
                                                                parseFloat(e.target.value) || 0,
                                                            )
                                                        }
                                                        className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                                        placeholder={
                                                            item.discountType === 'percentage' ? '%' : '$'
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            {/* Amount - With delete button on desktop */}
                                            <div className="md:col-span-2 md:flex">
                                                <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                    Valor Total
                                                </label>
                                                <div className="relative flex-grow">
                                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={item.amount.toFixed(2)}
                                                        readOnly
                                                        className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="hidden md:block md:ml-1">
                                                    {items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="h-full px-2 text-red-500 hover:text-red-700 border border-gray-300 rounded-lg"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Add item button */}
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="mt-2 flex items-center text-green-600 hover:text-green-800"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Agregar Detalle
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
                                {/* Additional Information Section - Replacing Notes field */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full md:w-1/2 order-2 md:order-1">
                                    <h2 className="text-lg font-medium text-gray-800 mb-4">
                                        Datos Adicionales
                                    </h2>
                                    {/* Table header - Responsive version */}
                                    <div className="hidden md:grid md:grid-cols-12 md:gap-2 mb-2 text-sm font-medium text-gray-700 px-2">
                                        <div className="md:col-span-5">Nombre</div>
                                        <div className="md:col-span-6">Valor</div>
                                        <div className="md:col-span-1"></div>
                                    </div>
                                    {/* Additional info items - Responsive version */}
                                    {additionalInfo.map((item, index) => (
                                        <div
                                            key={index}
                                            className="mb-4 md:mb-3 border border-gray-200 rounded-lg p-3 md:p-0 md:border-0"
                                        >
                                            {/* Mobile view item header */}
                                            <div className="flex justify-between items-center md:hidden mb-2">
                                                <div className="text-sm font-medium text-gray-700">
                                                    Info #{index + 1}
                                                </div>
                                                {additionalInfo.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAdditionalInfo(index)}
                                                        className="p-1 text-red-500 hover:text-red-700"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Responsive grid layout */}
                                            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-2 md:items-start">
                                                {/* Info field */}
                                                <div className="md:col-span-6">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                        Dato Adicional
                                                    </label>
                                                    <div className="relative">
                                                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Info className="h-4 w-4 text-gray-400" />
                                                        </div> */}
                                                        <input
                                                            type="text"
                                                            placeholder=""
                                                            value={item.info}
                                                            onChange={(e) =>
                                                                updateAdditionalInfo(index, 'info', e.target.value)
                                                            }
                                                            className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        />
                                                    </div>
                                                </div>
                                                {/* Value field */}
                                                <div className="md:col-span-5">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1 md:hidden">
                                                        Valor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder=""
                                                        value={item.value}
                                                        onChange={(e) =>
                                                            updateAdditionalInfo(index, 'value', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    />
                                                </div>
                                                {/* Delete button - desktop */}
                                                <div className="hidden md:flex md:col-span-1 md:items-center md:justify-center">
                                                    {additionalInfo.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAdditionalInfo(index)}
                                                            className="p-1 text-red-500 hover:text-red-700"
                                                            aria-label="Remove info"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Add additional info button */}
                                    <button
                                        type="button"
                                        onClick={addAdditionalInfo}
                                        className="mt-2 flex items-center text-green-600 hover:text-green-800"
                                    >
                                        <PlusCircle className="h-4 w-4 mr-1" />
                                        Agregar Dato Adicional
                                    </button>
                                </div>
                                {/* Total - Right half on desktop, first on mobile */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full md:w-1/2 order-1 md:order-2">
                                    <div className="w-full">
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium">Subtotal sin impuestos:</span>
                                            <span>${calculateSubtotalBeforeTaxes().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 text-red-600">
                                            <span className="font-medium">Descuento:</span>
                                            <span>-${calculateTotalDiscount().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium">Subtotal 0%:</span>
                                            <span>${calculateSubtotal0Percent().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium">Subtotal 15%:</span>
                                            <span>${calculateSubtotal15Percent().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 text-blue-600">
                                            <span className="font-medium">IVA 15%:</span>
                                            <span>${calculateTotalTax().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-200">
                                            <span>Total:</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex items-center justify-evenly'>
                                <button
                                    onClick={onCancel}
                                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-auto py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    Emitir Factura
                                </button>
                            </div>
                        </div>
                    </form>
                    {/* Cancel button */}
                    {/* <div className="mt-8 text-left">
                        <button
                            onClick={onCancel}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Cancelar
                        </button>
                    </div> */}
                </div>
            </div>
        </>
    )
}