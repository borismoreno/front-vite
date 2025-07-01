import { useEffect, useState } from "react"
// import { User, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getSettings } from "../../api/settings";
import type { ISettings } from "../../types/settings";

// Extend yup string schema to include 'integer' method for TypeScript
declare module 'yup' {
    interface StringSchema {
        integer(this: yup.StringSchema): yup.StringSchema;
    }
}

yup.addMethod<yup.StringSchema>(yup.string, 'integer', function () {
    return this.matches(/^\d+$/, 'Ingresa solo números');
});

const schema = yup.object({
    ruc: yup.string().integer().required('RUC es obligatorio'),
    razonSocial: yup.string().required('Razón Social es obligatorio'),
    nombreComercial: yup.string().required('Nombre Comercial es obligatorio'),
    direccion: yup.string().required('Dirección es obligatorio'),
    obligadoContabilidad: yup.boolean().required(),
    regimenMicroempresa: yup.boolean().required(),
    regimenRimpe: yup.boolean().required()
}).required();

type FormData = yup.InferType<typeof schema>;

export const Settings = () => {
    const [settings, setSettings] = useState<ISettings>();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            ruc: '',
            razonSocial: '',
            nombreComercial: '',
            direccion: '',
            obligadoContabilidad: false,
            regimenMicroempresa: false,
            regimenRimpe: false
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const response = await getSettings();
            setSettings(response);
        }
        fetchSettings();
    }, []);

    useEffect(() => {
        populateValues();
    }, [settings]);

    const populateValues = () => {
        if (settings) {
            setValue('ruc', settings.ruc);
            setValue('razonSocial', settings.razonSocial);
            setValue('nombreComercial', settings.nombreComercial);
            setValue('direccion', settings.direccionEstablecimiento);
            setValue('obligadoContabilidad', settings.obligadoContabilidad);
            setValue('regimenRimpe', settings.contribuyenteRimpe);
            setValue('regimenMicroempresa', settings.regimenMicroempresa);
        }
    }

    const handleSave = async (data: FormData) => {
        const updateCreateRequest: ISettings = {
            _id: settings?._id,
            nombreComercial: data.nombreComercial,
            obligadoContabilidad: data.obligadoContabilidad,
            activo: settings?.activo ?? true,
            razonSocial: data.razonSocial,
            direccionMatriz: settings?.direccionMatriz!,
            direccionEstablecimiento: data.direccion,
            contribuyenteRimpe: data.regimenRimpe,
            ruc: data.ruc,
            regimenMicroempresa: data.regimenMicroempresa
        };
        console.log('data', updateCreateRequest);

    }
    // const [image, setImage] = useState<string>(
    //     'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    // )
    // const [previewImage, setPreviewImage] = useState<string | null>(null)
    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0]
    //     if (file) {
    //         const reader = new FileReader()
    //         reader.onloadend = () => {
    //             setPreviewImage(reader.result as string)
    //         }
    //         reader.readAsDataURL(file)
    //     }
    // }
    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
                <p className="text-gray-600">
                    Administra las configuraciones de tu cuenta y tus preferencias
                </p>
            </div>
            <form onSubmit={handleSubmit(handleSave)}>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">General</h2>
                        {/* Profile Image */}
                        {/* <div className="flex items-start space-x-6 mb-6">
                        <div className="relative">
                            <img
                                src={previewImage || image}
                                alt="Profile"
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer border border-gray-200 hover:bg-gray-50">
                                <Upload className="w-4 h-4 text-gray-600" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                                Upload a new profile picture. Recommended size: 400x400px
                            </p>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Remove photo
                            </button>
                        </div>
                    </div> */}
                        {/* Profile Form */}
                        <div className="space-y-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    RUC
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    {...register('ruc')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {errors.ruc && <p className="pl-2 text-red-500 text-xs">{errors.ruc.message}</p>}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Razón Social
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    {...register('razonSocial')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {errors.razonSocial && <p className="pl-2 text-red-500 text-xs">{errors.razonSocial.message}</p>}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nombre Comercial
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    {...register('nombreComercial')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {errors.nombreComercial && <p className="pl-2 text-red-500 text-xs">{errors.nombreComercial.message}</p>}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    {...register('direccion')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {errors.direccion && <p className="pl-2 text-red-500 text-xs">{errors.direccion.message}</p>}
                            {/* <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                defaultValue="boris@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div> */}
                        </div>
                    </div>
                    {/* Account Settings */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Empresa
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Obligado a llevar contabilidad
                                    </h3>
                                    {/* <p className="text-sm text-gray-500">
                                    Enable or disable your account
                                </p> */}
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('obligadoContabilidad')}
                                        className="sr-only peer"
                                    // defaultChecked
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Régimen de Microempresa
                                    </h3>
                                    {/* <p className="text-sm text-gray-500">
                                    Receive email notifications about account activity
                                </p> */}
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('regimenMicroempresa')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Contribuyente Régimen RIMPE - Emprendedor
                                    </h3>
                                    {/* <p className="text-sm text-gray-500">
                                    Add an extra layer of security to your account
                                </p> */}
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" {...register('regimenRimpe')} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
