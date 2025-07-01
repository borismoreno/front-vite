import { useState, useEffect } from 'react';
import { getDashboardInfo } from './api/dashboard';
import './App.css'
import { useAppSelector } from './app/hooks';
import { StatsCards } from './components/dashboard/StatsCards';
import type { IDashboard } from './types/dashboard';

function App() {
    const [dashboardInfo, setDashboardInfo] = useState<IDashboard>();

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            const response = await getDashboardInfo(new Date('2023-01-01').toISOString(), new Date('2023-12-31').toISOString());
            setDashboardInfo(response);
        };
        fetchDashboardInfo();
    }, []);
    const { user } = useAppSelector((state) => state.auth);
    // obtener saludo basado en la hora actual
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Buen día' : currentHour < 18 ? 'Buena tarde' : 'Buena noche';

    return (
        <>
            <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
                <div className="mb-4 sm:mb-6">
                    <p className="text-gray-600 mb-1 text-sm sm:text-base">
                        {greeting}
                    </p>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Hola, {user?.name} 👋
                    </h1>
                </div>
                <StatsCards dashboardInfo={dashboardInfo?.metrics} />
                {/* <ClientesTable clientes={dashboardInfo?.clientes} /> */}

            </div>
        </>
    )
}

export default App
