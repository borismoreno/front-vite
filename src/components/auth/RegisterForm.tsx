import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from 'react'
import { toast } from 'react-toastify';
import {
    Mail,
    Lock,
    ArrowLeft,
    User,
    Eye,
    EyeOff,
    UserPlus,
    Phone
} from 'lucide-react'
import { NavLink } from 'react-router';
import { registerUser } from '../../api/user';

const schema = yup.object({
    fullName: yup.string().required('Nombre completo es obligatorio'),
    email: yup.string().email('Email no válido').required('Email es obligatorio'),
    phone: yup.string().matches(/^09\d{8}$/, 'Ingresa un número de teléfono válido').required('Teléfono es obligatorio'),
    password: yup.string().min(6, 'El password debe tener mínimo 6 caracteres').required('Password es obligatorio'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
        .required('Confirmar password es obligatorio'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, touchedFields }
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    const handleRegister = async (data: FormData) => {
        // Aquí puedes manejar el registro del usuario
        const response = await registerUser({
            nombre: data.fullName,
            email: data.email,
            telefono: data.phone,
            password: data.password
        });

        if (response.success) {
            toast.success('Usuario registrado exitosamente');
            // Aquí puedes redirigir al usuario o realizar otra acción
            // Por ejemplo, redirigir a la página de login
            // navigate('/login');
            navigate('/login');
        } else {
            toast.error(response.message || 'Error al registrar usuario');
        }
        console.log('Respuesta del registro:', response);
        // Por ejemplo, enviar los datos a una API o actualizar el estado global
    }
    return (
        <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto items-center justify-center p-4 md:p-8">
            {/* Left side - Illustration */}
            <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                <div className="relative">
                    {/* Background circle */}
                    <div className="w-56 h-56 bg-gray-100 rounded-full flex items-center justify-center">
                        {/* User icon */}
                        <div className="w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center">
                            <UserPlus className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
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
            {/* Right side - Register form */}
            <div className="w-full md:w-1/2 max-w-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                    Factura Ágil
                </h1>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="space-y-4">
                        {/* Full name field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                type="text"
                                {...register('fullName')}
                                placeholder="Nombre Completo"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={async (e) => {
                                    register('fullName').onChange(e);
                                    if (touchedFields.fullName) {
                                        await trigger('fullName');
                                    }
                                }}
                            />
                        </div>
                        {errors.fullName && <p className="pl-4 text-red-500 text-xs">{errors.fullName.message}</p>}
                        {/* Email field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                type="email"
                                {...register('email')}
                                placeholder="Email"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={async (e) => {
                                    register('email').onChange(e);
                                    if (touchedFields.email) {
                                        await trigger('email');
                                    }
                                }}
                            />
                        </div>
                        {errors.email && <p className="pl-4 text-red-500 text-xs">{errors.email.message}</p>}
                        {/* Telefono field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                autoComplete='off'
                                type="text"
                                {...register('phone')}
                                placeholder="Teléfono"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={async (e) => {
                                    register('phone').onChange(e);
                                    if (touchedFields.phone) {
                                        await trigger('phone');
                                    }
                                }}
                            />
                        </div>
                        {errors.phone && <p className="pl-4 text-red-500 text-xs">{errors.phone.message}</p>}
                        {/* Password field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                placeholder="Password"
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={async (e) => {
                                    register('password').onChange(e);
                                    if (touchedFields.password) {
                                        await trigger('password');
                                    }
                                }}
                            />
                            <button
                                tabIndex={-1}
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="pl-4 text-red-500 text-xs">{errors.password.message}</p>}
                        {/* Confirm Password field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                placeholder="Confirmar Password"
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={async (e) => {
                                    register('confirmPassword').onChange(e);
                                    if (touchedFields.confirmPassword) {
                                        await trigger('confirmPassword');
                                    }
                                }}
                            />
                            <button
                                tabIndex={-1}
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="pl-4 text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                        {/* Register button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            CREAR CUENTA
                        </button>
                        {/* Terms and conditions */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Al crear la cuenta, aceptas nuestros
                                <a href="#" className="text-green-600 hover:text-green-700">
                                    {' '}
                                    Términos y Condiciones{' '}
                                </a>
                                y
                                <a href="#" className="text-green-600 hover:text-green-700">
                                    {' '}
                                    Política de Privacidad{' '}
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
                {/* Back to login link */}
                <div className="mt-12 text-left">
                    <NavLink
                        to="/login"
                        // onClick={onLoginClick}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Volver a Iniciar Sesión
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
