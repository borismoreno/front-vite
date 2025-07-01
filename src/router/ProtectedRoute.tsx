import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from "../app/hooks";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
