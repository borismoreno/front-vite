import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { useAppDispatch } from "../../app/hooks";
import { login } from "../../reducers/authSlice";
import { login as loginApi } from '../../api/auth';
import { useState } from 'react';
import { NavLink } from 'react-router';
import { Loading } from '../Loading';

const schema = yup.object({
    email: yup.string().email('Email no válido').required('Email es obligatorio'),
    password: yup.string().min(6, 'El password debe tener mínimo 6 caracteres').required('Password es obligatorio'),
}).required();

type FormData = yup.InferType<typeof schema>;

export const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: true,
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const dispatch = useAppDispatch();
    const handleLogin = async (data: FormData) => {
        try {
            setLoading(true);
            const response = await loginApi({
                email: data.email,
                password: data.password
            });
            if (response.token) {
                dispatch(login({
                    id: response.user?._id!,
                    name: response.user?.nombre!,
                    email: response.user?.email!,
                    empresa: response.user?.empresa!
                }));
            }
            else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error al iniciar sesión.')
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading text='Iniciando Sesión' />}
            <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto items-center justify-center p-4 md:p-8">
                {/* Left side - Illustration */}
                <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                    <div className="relative">
                        {/* Background circle */}
                        <div className="w-56 h-56 bg-gray-100 rounded-full flex items-center justify-center">
                            {/* Laptop/User icon */}
                            <div className="w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
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
                <div className="w-full md:w-1/2 max-w-md">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                        Factura Ágil
                    </h1>
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    {...register('email')}
                                    placeholder="Email"
                                    autoComplete='off'
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            {errors.email && <p className="pl-4 text-red-500 text-xs">{errors.email.message}</p>}
                            {/* Password field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder="Password"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <button
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
                            {/* Login button */}
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? 'cursor-default bg-gray-500 focus:ring-gray-500' : 'bg-green-500 focus:ring-green-500 hover:bg-green-600'}`}
                                disabled={loading}
                            >
                                INICIAR SESIÓN
                            </button>
                            {/* Forgot password link */}
                            <div className="text-center">
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>
                    </form>
                    {/* Create account link */}
                    <div className="mt-12 text-right">
                        <NavLink
                            to={'/register'}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                            Registrarse
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
