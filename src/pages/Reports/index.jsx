import React, { useState } from "react";
import ReportTable from "../../components/ReportTable";
import { Calendar } from 'primereact/calendar';

const Reports = () => {
    const [dateRange, setDateRange] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [today, today];
    });

    const handleDateChange = (e) => {
        setDateRange(e.value);
    };

    return (
        <>
            <h4>Огноогоо сонгоно уу</h4>
            <Calendar
                value={dateRange}
                onChange={handleDateChange}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
                className="mb-3"
            />
            <ReportTable dateRange={dateRange} />
        </>
    );
}

export default Reports;
