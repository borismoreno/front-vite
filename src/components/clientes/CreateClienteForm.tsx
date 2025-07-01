import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {
    User,
    Mail,
    Phone,
    MapPin,
    IdCardIcon,
    Save,
    ArrowLeft,
    Briefcase,
    ChevronDown,
    Check,
} from 'lucide-react'
import type { ICliente } from '../../types/cliente';
import { getTiposIdentificacion } from '../../api/general';
import type { ITipoIdentificacion } from '../../types/general';

const schema = yup.object({
    razonSocial: yup.string().required('La razón social es obligatoria'),
    tipoIdentificacion: yup.string().required('El tipo de identificación es obligatorio'),
    numeroIdentificacion: yup.string().required('El número de identificación es obligatorio'),
    telefono: yup.string().required('El teléfono es obligatorio'),
    mail: yup.string().email('Correo elctrónico no válido').required('El correo elctrónico es obligatorio'),
    direccion: yup.string().required('La dirección es obligatoria'),
}).required();

type FormData = yup.InferType<typeof schema>;

interface CreateClientFormProps {
    onCancel: () => void
    onSubmit: (clientData: ICliente) => void
    initialData?: ICliente | null
    isEditing?: boolean
}
export function CreateClientForm({
    onCancel,
    onSubmit,
    initialData,
    isEditing = false,
}: CreateClientFormProps) {
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState<boolean>(false);
    const [tiposIdentificacion, setTiposIdentificacion] = useState<ITipoIdentificacion[]>
        ([]);
    const [selectedTipoIdentificacion, setSelectedTipoIdentificacion] = useState<string>('')
    const clientDropdownRef = useRef<HTMLDivElement>(null)
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            razonSocial: initialData?.razonSocial || '',
            tipoIdentificacion: initialData?.tipoIdentificacion || '',
            numeroIdentificacion: initialData?.numeroIdentificacion || '',
            telefono: initialData?.telefono || '',
            mail: initialData?.mail || '',
            direccion: initialData?.direccion || '',
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            const response = await getTiposIdentificacion();
            setTiposIdentificacion(response.map(tipo => ({
                codigo: tipo.codigo,
                tipoIdentificacion: tipo.tipoIdentificacion.toLocaleLowerCase(),
            })));
            if (initialData && initialData.tipoIdentificacion) {
                const tipo = response.find(t => t.codigo === initialData.tipoIdentificacion);
                if (tipo) {
                    setSelectedTipoIdentificacion(tipo.tipoIdentificacion.toLocaleLowerCase());
                    setValue('tipoIdentificacion', tipo.codigo);
                }
            }
        }
        fetchData();
    }, []);
    const toggleClientDropdown = () => {
        setIsClientDropdownOpen(!isClientDropdownOpen)
    }
    const handleOnSubmit = async (data: FormData) => {
        const request: ICliente = {
            razonSocial: data.razonSocial,
            tipoIdentificacion: data.tipoIdentificacion,
            numeroIdentificacion: data.numeroIdentificacion,
            telefono: data.telefono,
            mail: data.mail,
            direccion: data.direccion,
        };
        onSubmit(request);
    }
    const selectTipoIdentificacion = (codigo: string, tipoIdentificacion: string) => {
        setSelectedTipoIdentificacion(tipoIdentificacion);
        setIsClientDropdownOpen(false);
        setValue('tipoIdentificacion', codigo);
        if (errors.tipoIdentificacion) {
            delete errors.tipoIdentificacion;
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
    return (
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto items-center justify-center p-4 md:p-8">
            {/* Left side - Illustration */}
            <div className="hidden sm:flex w-full md:w-1/2 justify-center mb-8 md:mb-0">
                <div className="relative">
                    {/* Background circle */}
                    <div className="w-56 h-56 bg-gray-100 rounded-full flex items-center justify-center">
                        {/* Client icon */}
                        <div className="w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center">
                            <Briefcase
                                className="w-16 h-16 text-gray-300"
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-20 -translate-y-4">
                        <div className="w-3 h-3 border border-gray-300 rotate-45"></div>
                    </div>
                    <div className="absolute bottom-6 left-0 -translate-x-8">
                        <div className="w-6 h-6 rounded-full border border-teal-400"></div>
                    </div>
                    <div className="absolute top-1/2 right-0 translate-x-6">
                        <div className="w-4 h-4 rounded-full bg-teal-100"></div>
                    </div>
                    <div className="absolute right-1/4 top-0 -translate-y-6">
                        <div className="w-6 h-6 text-green-400">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-1/4 translate-y-6">
                        <div className="w-6 h-6 text-green-300 transform rotate-45">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right side - Client form */}
            <div className="w-full md:w-1/2 max-w-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center md:text-left">
                    {isEditing ? 'Editar Cliente' : 'Agregar Cliente'}
                </h1>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div className="space-y-4">
                        {/* Client name field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                type="text"
                                placeholder="Razón Social"
                                {...register('razonSocial')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.razonSocial && <p className="pl-4 text-red-500 text-xs">{errors.razonSocial.message}</p>}
                        {/* Tipo de identificación field */}
                        <div className="relative" ref={clientDropdownRef}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <button
                                type="button"
                                onClick={toggleClientDropdown}
                                className={`block w-full pl-10 pr-10 py-3 border capitalize border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left ${selectedTipoIdentificacion ? 'text-gray-900' : 'text-gray-400'}`}
                            >
                                {selectedTipoIdentificacion || 'Tipo de Identificación'}
                            </button>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <ChevronDown
                                    className={`h-4 w-4 text-gray-400 transition-transform ${isClientDropdownOpen ? 'transform rotate-180' : ''}`}
                                />
                            </div>
                            {isClientDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {tiposIdentificacion.map((tipo) => (
                                        <div
                                            key={tipo.codigo}
                                            onClick={() => selectTipoIdentificacion(tipo.codigo, tipo.tipoIdentificacion)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                        >
                                            {selectedTipoIdentificacion === tipo.tipoIdentificacion && (
                                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                            )}
                                            <div>
                                                <span
                                                    className={
                                                        `capitalize ${selectedTipoIdentificacion === tipo.tipoIdentificacion
                                                            ? 'font-medium'
                                                            : ''}`
                                                    }
                                                >
                                                    {tipo.tipoIdentificacion.toLocaleLowerCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.tipoIdentificacion && <p className="pl-4 text-red-500 text-xs">{errors.tipoIdentificacion.message}</p>}
                        {/* Número de identificación field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IdCardIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                type="text"
                                placeholder="Número de Identificación"
                                {...register('numeroIdentificacion')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.numeroIdentificacion && <p className="pl-4 text-red-500 text-xs">{errors.numeroIdentificacion.message}</p>}
                        {/* Email field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                type="email"
                                placeholder="Correo Electrónico"
                                {...register('mail')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.mail && <p className="pl-4 text-red-500 text-xs">{errors.mail.message}</p>}
                        {/* Phone field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                placeholder="Teléfono"
                                {...register('telefono')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.telefono && <p className="pl-4 text-red-500 text-xs">{errors.telefono.message}</p>}
                        {/* Address field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                autoComplete='off'
                                placeholder="Dirección"
                                {...register('direccion')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        {errors.direccion && <p className="pl-4 text-red-500 text-xs">{errors.direccion.message}</p>}
                        {/* Save button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {isEditing ? 'ACTUALIZAR CLIENTE' : 'GUARDAR CLIENTE'}
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
        </div>
    )
}
