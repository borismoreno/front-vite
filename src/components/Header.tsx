import { Settings, ChevronDown, Menu, User, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { NavLink } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { logout } from '../reducers/authSlice';

interface HeaderProps {
    onMenuClick: () => void
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    const { user } = useAppSelector((state) => state.auth);
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Handle clicking outside of dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen)
    }
    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false)
    }
    const handleProfileClick = () => {
        console.log('Profile clicked')
        setIsProfileOpen(false)
    }

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <NavLink to='/' className="text-lg sm:text-xl font-semibold text-gray-900">
                        {user ? `${user?.empresa}` : ''}
                    </NavLink>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="flex items-center space-x-2 sm:space-x-4">

                        {/* Create Invoice button */}
                        {/* <button className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                            <span className="hidden sm:inline">+ Nueva Factura</span>
                            <span className="sm:hidden">+ Factura</span>
                        </button> */}
                        {/* Settings and notifications - Hidden on mobile */}
                        <NavLink to='/settings' className="hidden sm:block p-2 text-gray-400 hover:text-gray-600">
                            <Settings className="h-5 w-5" />
                        </NavLink>
                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleProfile}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <img
                                    className="h-10 w-10 rounded-full flex-shrink-0"
                                    src={
                                        user?.name
                                            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                                            : 'https://ui-avatars.com/api/?name=User&background=random'
                                    }
                                    alt={user?.name || 'User'}
                                />
                                <ChevronDown
                                    className={`h-4 w-4 text-gray-400 hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`}
                                />
                            </button>
                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Mi Perfil
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
