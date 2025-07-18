import { useEffect, useState } from "react";
import { getFacturasEmitidas, type SearchType } from "../../api/comprobantes"
import type { IFacturaEmitida } from "../../types/comprobante";
import { FacturasEmitidasTable } from "../../components/comprobantes/FacturasEmitidasTable";
import { toast } from "react-toastify";
import { Loading } from "../../components/Loading";

export const FacturasScreen = () => {
    const [facturasEmitidas, setFacturasEmitidas] = useState<IFacturaEmitida[]>([]);
    const [dateRangeOption, setDateRangeOption] = useState<SearchType>('currentMonth');
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchFaturas = async () => {
        try {
            setLoading(true);
            if (dateRangeOption === 'custom' && (!startDate || !endDate)) return;
            const response = await getFacturasEmitidas(
                dateRangeOption,
                dateRangeOption === 'custom' && startDate ? startDate : undefined,
                dateRangeOption === 'custom' && endDate ? endDate : undefined
            );
            setFacturasEmitidas(response);
        } catch (error) {
            console.log(error);
            toast.error('Error al cargar las facturas.')
        } finally {
            setLoading(false);
        }
    }

    const handleDateChanged = (dateOption: SearchType, startDateCall?: Date, endDateCall?: Date) => {
        setDateRangeOption(dateOption);
        setStartDate(startDateCall);
        setEndDate(endDateCall);
    }

    useEffect(() => {
        fetchFaturas();
    }, [dateRangeOption, startDate, endDate]);

    return (
        <>
            {loading && <Loading text="Cargando Facturas" size="lg" />}
            <FacturasEmitidasTable facturasEmitidas={facturasEmitidas} onDateChanged={handleDateChanged} />
        </>
    )
}
