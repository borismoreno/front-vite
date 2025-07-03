import { useEffect, useRef, useState } from "react"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import type { IProducto } from "../../types/producto"
import type { ITipoProducto, ITarifaIva } from "../../types/general"
import { getTarifasIva, getTiposProducto } from "../../api/general"
import { ArrowLeft, Check, ChevronDown, DollarSign, FileText, Save, Tag, Bookmark, PackageSearch, DiamondPercent } from "lucide-react";

const schema = yup.object({
    descripcion: yup.string().required("La descripción es obligatoria"),
    codigoPrincipal: yup.string().max(10, "El Código Principal debe ser de máximo 10 caracteres"),
    codigoAuxiliar: yup.string().max(10, "El Código Auxiliar debe ser de máximo 10 caracteres"),
    tipoProducto: yup.string().required("El tipo de producto es obligatorio"),
    tarifaIva: yup.string().required("La tarifa de IVA es obligatoria"),
    valorUnitario: yup.number()
        .typeError("El valor unitario debe ser un número")
        .positive("El valor unitario debe ser un número positivo")
        .required("El valor unitario es obligatorio"),
}).required();

type FormData = yup.InferType<typeof schema>;

interface ICreateProductoFormProps {
    onCancel: () => void
    onSubmit: (productData: IProducto) => void
    initialData?: IProducto | null
    isEditing?: boolean
}

export function CreateProductoForm({
    onCancel,
    onSubmit,
    initialData,
    isEditing = false,
}: ICreateProductoFormProps) {
    const [tiposProducto, setTiposProducto] = useState<ITipoProducto[]>([]);
    const [tarifasIva, setTarifasIva] = useState<ITarifaIva[]>([]);
    const [selectedTipoProducto, setSelectedTipoProducto] = useState<string>('')
    const [isTipoProductoDropdownOpen, setIsTipoProductoDropdownOpen] = useState<boolean>(false);
    const tipoProductoDropdownRef = useRef<HTMLDivElement>(null)

    const [selectedTarifaIva, setSelectedTarifaIva] = useState<string>('')
    const [isTarifaIvaDropdownOpen, setIsTarifaIvaDropdownOpen] = useState<boolean>(false);
    const tarifaIvaDropdownRef = useRef<HTMLDivElement>(null)

    const {
        register,
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
            descripcion: initialData?.descripcion || '',
            codigoPrincipal: initialData?.codigoPrincipal || undefined,
            codigoAuxiliar: initialData?.codigoAuxiliar || '',
            tipoProducto: initialData?.tipoProducto || '',
            tarifaIva: initialData?.tarifaIva || '',
            valorUnitario: initialData?.valorUnitario || 0,
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            const tiposProductoResponse = await getTiposProducto();
            setTiposProducto(tiposProductoResponse.map(tipo => ({
                codigo: tipo.codigo,
                descripcion: tipo.descripcion.toLocaleLowerCase()
            })));
            const tarifasIvaResponse = await getTarifasIva();
            setTarifasIva(tarifasIvaResponse.map(tarifa => ({
                codigo: tarifa.codigo,
                porcentaje: tarifa.porcentaje.toLocaleLowerCase()
            })));
            if (initialData && initialData.tipoProducto) {
                const tipo = tiposProductoResponse.find(t => t.codigo === initialData.tipoProducto);
                if (tipo) {
                    setSelectedTipoProducto(tipo.descripcion.toLocaleLowerCase());
                    setValue('tipoProducto', tipo.codigo);
                }
            }
            if (initialData && initialData.tarifaIva) {
                const tarifa = tarifasIvaResponse.find(t => t.codigo === initialData.tarifaIva);
                if (tarifa) {
                    setSelectedTarifaIva(tarifa.porcentaje.toLocaleLowerCase());
                    setValue('tarifaIva', tarifa.codigo);
                }
            }
        }
        fetchData();
    }, []);

    const onHandleSubmit = async (data: FormData) => {
        const request: IProducto = {
            descripcion: data.descripcion,
            codigoPrincipal: data.codigoPrincipal,
            codigoAuxiliar: data.codigoAuxiliar,
            tipoProducto: data.tipoProducto,
            tarifaIva: data.tarifaIva,
            valorUnitario: data.valorUnitario
        }
        onSubmit(request);
    }

    const toggleClientDropdown = () => {
        setIsTipoProductoDropdownOpen(!isTipoProductoDropdownOpen);
    }

    const toggleTarifaIvaDropdown = () => {
        setIsTarifaIvaDropdownOpen(!isTarifaIvaDropdownOpen);
    }

    const selectTipoProducto = (codigo: string, tipoProducto: string) => {
        setSelectedTipoProducto(tipoProducto);
        setIsTipoProductoDropdownOpen(false);
        setValue('tipoProducto', codigo);
        if (errors.tipoProducto) {
            delete errors.tipoProducto;
        }
    }

    const selectTarifaIva = (codigo: string, porcentaje: string) => {
        setSelectedTarifaIva(porcentaje);
        setIsTarifaIvaDropdownOpen(false);
        setValue('tarifaIva', codigo);
        if (errors.tarifaIva) {
            delete errors.tarifaIva;
        }
    }

    // Close client dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                tipoProductoDropdownRef.current &&
                !tipoProductoDropdownRef.current.contains(event.target as Node)
            ) {
                setIsTipoProductoDropdownOpen(false)
            }
        }
        // Only add the event listener if the dropdown is open
        if (isTipoProductoDropdownOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isTipoProductoDropdownOpen])

    // Close client dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                tarifaIvaDropdownRef.current &&
                !tarifaIvaDropdownRef.current.contains(event.target as Node)
            ) {
                setIsTarifaIvaDropdownOpen(false)
            }
        }
        // Only add the event listener if the dropdown is open
        if (isTarifaIvaDropdownOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isTarifaIvaDropdownOpen])

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                {isEditing ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            autoComplete='off'
                            type="text"
                            placeholder="Código Principal (Opcional)"
                            {...register('codigoPrincipal')}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    {errors.codigoPrincipal && <p className="pl-4 text-red-500 text-xs">{errors.codigoPrincipal.message}</p>}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Bookmark className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            autoComplete='off'
                            type="text"
                            placeholder="Código Auxiliar (Opcional)"
                            {...register('codigoAuxiliar')}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    {errors.codigoAuxiliar && <p className="pl-4 text-red-500 text-xs">{errors.codigoAuxiliar.message}</p>}
                    {/*Tipo Producto Field*/}
                    <div className="relative" ref={tipoProductoDropdownRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PackageSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <button
                            type="button"
                            onClick={toggleClientDropdown}
                            className={`block w-full pl-10 pr-10 py-3 border capitalize border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left ${selectedTipoProducto ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                            {selectedTipoProducto || 'Tipo Producto'}
                        </button>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform ${isTipoProductoDropdownOpen ? 'transform rotate-180' : ''}`}
                            />
                        </div>
                        {isTipoProductoDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                {tiposProducto.map((tipo) => (
                                    <div
                                        key={tipo.codigo}
                                        onClick={() => selectTipoProducto(tipo.codigo, tipo.descripcion)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    >
                                        {selectedTipoProducto === tipo.descripcion && (
                                            <Check className="h-4 w-4 text-green-500 mr-2" />
                                        )}
                                        <div>
                                            <span
                                                className={
                                                    `capitalize ${selectedTipoProducto === tipo.descripcion
                                                        ? 'font-medium'
                                                        : ''}`
                                                }
                                            >
                                                {tipo.descripcion.toLocaleLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.tipoProducto && <p className="pl-4 text-red-500 text-xs">{errors.tipoProducto.message}</p>}
                    {/*Tarifa Iva Field*/}
                    <div className="relative" ref={tarifaIvaDropdownRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DiamondPercent className="h-5 w-5 text-gray-400" />
                        </div>
                        <button
                            type="button"
                            onClick={toggleTarifaIvaDropdown}
                            className={`block w-full pl-10 pr-10 py-3 border capitalize border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left ${selectedTarifaIva ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                            {selectedTarifaIva || 'Tarifa IVA'}
                        </button>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform ${isTarifaIvaDropdownOpen ? 'transform rotate-180' : ''}`}
                            />
                        </div>
                        {isTarifaIvaDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                {tarifasIva.map((tipo) => (
                                    <div
                                        key={tipo.codigo}
                                        onClick={() => selectTarifaIva(tipo.codigo, tipo.porcentaje)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    >
                                        {selectedTarifaIva === tipo.porcentaje && (
                                            <Check className="h-4 w-4 text-green-500 mr-2" />
                                        )}
                                        <div>
                                            <span
                                                className={
                                                    `capitalize ${selectedTarifaIva === tipo.porcentaje
                                                        ? 'font-medium'
                                                        : ''}`
                                                }
                                            >
                                                {tipo.porcentaje.toLocaleLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.tarifaIva && <p className="pl-4 text-red-500 text-xs">{errors.tarifaIva.message}</p>}
                    {/* Notes field */}
                    <div className="relative">
                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            autoComplete="off"
                            placeholder="Descripción"
                            {...register('descripcion')}
                            rows={3}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl h-54 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        ></textarea>
                    </div>
                    {errors.descripcion && <p className="pl-4 text-red-500 text-xs">{errors.descripcion.message}</p>}
                    {/* Valor Unitario field */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            autoComplete='off'
                            type="text"
                            placeholder="Valor Unitario"
                            {...register('valorUnitario')}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    {errors.valorUnitario && <p className="pl-4 text-red-500 text-xs">{errors.valorUnitario.message}</p>}
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
            {/* Cancel button */}
            <div className="mt-8 text-left">
                <button
                    onClick={onCancel}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Cancelar
                </button>
            </div>
        </div>
    )
}