import type { IDashboardInfo } from '../../types/dashboard';
import { Receipt, DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
    dashboardInfo?: IDashboardInfo[];
}

export const StatsCards = ({ dashboardInfo }: StatsCardsProps) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardInfo && dashboardInfo.map((stat, index) => <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'}`}>
                        {
                            stat.title === 'Total Facturado'
                                ? (<DollarSign className={`h-5 w-5 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />)
                                : stat.title === 'Facturas'
                                    ? (<Receipt className={`h-5 w-5 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />)
                                    : stat.title === 'Nuevos Clientes'
                                        ? (<Users className={`h-5 w-5 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />)
                                        : null
                        }
                    </div>
                    <span className="text-gray-400 hover:text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                    </span>
                </div>
                <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.title === 'Total Facturado' ? stat.value.toFixed(2) : stat.value}</p>
                </div>
                <div className="flex items-center text-sm">
                    <span className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {stat.change}
                    </span>
                    <span className="text-gray-500 ml-2">{stat.subtitle}</span>
                </div>
            </div>)}
        </div>
    )
}
