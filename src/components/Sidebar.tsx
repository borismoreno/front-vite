import {
    LayoutDashboard, Users, FileText, Package, X, Settings,
    LogOut,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../reducers/authSlice';

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const menuItems = [{
        icon: LayoutDashboard,
        label: 'Dashboard',
        to: '/'
    }, {
        icon: Users,
        label: 'Clientes',
        to: '/clientes'
    }, {
        icon: Package,
        label: 'Productos',
        to: '/productos'
    }, {
        icon: FileText,
        label: 'Facturas',
        to: '/facturas'
    }];
    // return (
    //     <>
    //         {/* Mobile overlay */}
    //         {isOpen && (
    //             <div
    //                 className="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] z-40 lg:hidden"
    //                 onClick={onClose}
    //             />
    //         )}
    //         <div
    //             className={`
    //                 fixed lg:static inset-y-0 left-0 z-50 lg:z-0
    //                 w-64 bg-white border-r border-gray-200
    //                 transform transition-transform duration-300 ease-in-out lg:transform-none h-screen
    //                 flex flex-col
    //                 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    //             `}
    //         >
    //             <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
    //                 <div className="flex items-center justify-between">
    //                     <div className="flex items-center space-x-2">
    //                         <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
    //                             <span className="text-white font-bold text-sm">FA</span>
    //                         </div>
    //                         <span className="font-semibold text-gray-900">Factura Ágil</span>
    //                     </div>
    //                     <button
    //                         onClick={onClose}
    //                         className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
    //                     >
    //                         <X className="h-5 w-5" />
    //                     </button>
    //                 </div>
    //             </div>
    //             <div className="flex-1 overflow-y-auto">
    //                 <div className="py-4 sm:py-6">
    //                     <div className="px-4 sm:px-6 mb-6">
    //                         <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
    //                             MENU GENERAL
    //                         </p>
    //                         <nav className="space-y-1">
    //                             {menuItems.map((item) => (
    //                                 <NavLink
    //                                     key={item.label}
    //                                     to={item.to}
    //                                     className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === item.to ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
    //                                     onClick={() => onClose()}
    //                                 >
    //                                     <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
    //                                     {item.label}
    //                                 </NavLink>
    //                             ))}
    //                         </nav>
    //                     </div>
    //                 </div>
    //                 {/* Bottom fixed section */}
    //                 <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200">
    //                     <nav className="space-y-1">
    //                         <NavLink
    //                             to="/settings"
    //                             className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${pathname === '/settings' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
    //                             onClick={() => onClose()}
    //                         >
    //                             <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
    //                             Configuración
    //                         </NavLink>
    //                         <button
    //                             onClick={() => dispatch(logout())}
    //                             className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
    //                         >
    //                             <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
    //                             Cerrar sesión
    //                         </button>
    //                     </nav>
    //                 </div>
    //             </div>
    //         </div>
    //     </>)
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            {/* Sidebar */}
            <div
                className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out lg:transform-none h-screen
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
            >
                {/* Logo section - fixed at top */}
                <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">FA</span>
                            </div>
                            <span className="font-semibold text-gray-900">Factura Ágil</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                {/* Menu sections - scrollable middle */}
                <div className="flex-1 overflow-y-auto">
                    <div className="py-4 sm:py-6">
                        <div className="px-4 sm:px-6 mb-6">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                                GENERAL MENU
                            </p>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.to}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === item.to ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                        onClick={() => onClose()}
                                    >
                                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                        {/* <div className="px-4 sm:px-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                OTHER MENU
              </p>
              <nav className="space-y-1">
                {otherMenuItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => onClose()}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div> */}
                    </div>
                </div>
                {/* Bottom section - fixed at bottom */}
                <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200">
                    <nav className="space-y-1">
                        <NavLink
                            to="/settings"
                            className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${pathname === '/settings' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => onClose()}
                        >
                            <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                            Configuración
                        </NavLink>
                        <button
                            onClick={() => dispatch(logout())}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                            Cerrar sesión
                        </button>
                    </nav>
                </div>
            </div>
        </>
    )
}
