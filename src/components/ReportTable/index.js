import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const ReportTable = ({ dateRange }) => {
    const [orders, setOrders] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);

    const getOrders = async () => {
        try {
            const response = await fetch("http://localhost:5000/order");
            const jsonData = await response.json();
            setOrders(jsonData);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    const formatDay = (timestamp) => {
        const date = new Date(timestamp);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filterOrdersByDateRange = (orders) => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) return orders;

        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);

        return orders.filter(order => {
            const orderDate = new Date(order.date_created);
            return orderDate >= startDate && orderDate <= endDate;
        });
    };

    const filteredOrders = filterOrdersByDateRange(orders);

    const customerNames = filteredOrders.reduce((acc, order) => {
        (acc[order.customer_name] = acc[order.customer_name] || []).push(order);
        return acc;
    }, {});

    const groupedCustomers = Object.entries(customerNames).map(([name, orders], index) => ({
        id: index + 1,
        name,
        orders
    }));


    const rowExpansionTemplate = (data) => {
        const total = data.orders.reduce((sum, order) => sum + order.total_price, 0);

        return (
            <div className="p-3">
                <h5>Orders for {data.name}</h5>
                <DataTable
                    value={data.orders}
                    dataKey="id"
                    tableStyle={{ minWidth: '50rem' }}
                    footer={`Нийт: ${total.toFixed()}`}
                    paginator rows={4} rowsPerPageOptions={[4, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column field="product_name" header="Барааны нэр" sortable style={{ width: '25%' }} />
                    <Column field="total_quantity" header="Тоо хэмжээ" sortable style={{ width: '25%' }} />
                    <Column field="total_price" header="Үнэ" body={(rowData) => `${rowData.total_price.toFixed()}`} sortable style={{ width: '25%' }} />
                    <Column
                        field="date_created"
                        header="Захиалсан өдөр"
                        sortable style={{ width: '25%' }}
                        body={(rowData) => formatDay(rowData.date_created)}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <div>
            <DataTable
                value={groupedCustomers}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                tableStyle={{ minWidth: '20rem' }}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="name" header="Харилцагч" />
            </DataTable>
        </div>
    );
}

export default ReportTable;