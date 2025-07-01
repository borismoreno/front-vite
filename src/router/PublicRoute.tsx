import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from "../app/hooks";

export const PublicRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
