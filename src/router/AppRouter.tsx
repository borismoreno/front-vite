import { BrowserRouter, Route, Routes } from 'react-router'
import App from '../App'
import { Login } from '../pages/auth/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '../components/MainLayout'
import { PublicRoute } from './PublicRoute'
import { ForgotPassword } from '../pages/auth/ForgotPassword'
import { Register } from '../pages/auth/Register'
import { FacturasScreen } from '../pages/comprobantes/FacturasScreen'
import { Clientes } from '../pages/admin/Clientes'
import { Productos } from '../pages/admin/Productos'
import { Settings } from '../pages/admin/Settings'
import { WebSocketProvider } from '../context/WebSocketContext'

export const AppRouter = () => {
    return (<BrowserRouter>
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route element={<WebSocketProvider><MainLayout /></WebSocketProvider>} >
                    <Route path="/" element={<App />} />
                    <Route path="/facturas" element={<FacturasScreen />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Route>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
            </Route>
        </Routes>
    </BrowserRouter>)

}
