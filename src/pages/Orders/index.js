import React, { useCallback, useState } from 'react';
import OrderTable from '../../components/OrderTable';
import Checkout from '../../components/Checkout';
import StoreChecker from '../../components/StoreChecker';

const Orders = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);
    const [resetTrigger, setResetTrigger] = useState(false);

    const handleSelectionProductChange = useCallback((products) => {
        setSelectedProducts(products);
    }, []);


    const handleSelectionStoreChange = (stores) => {
        setSelectedStores(stores);
    };

    const handleReset = () => {
        setSelectedProducts([]);
        setSelectedStores([]);
        setResetTrigger(!resetTrigger);
    };

    return (
        <>
            <StoreChecker onSelectionChange={handleSelectionStoreChange} resetTrigger={resetTrigger} />
            <OrderTable onSelectionChange={handleSelectionProductChange} resetTrigger={resetTrigger} />
            <Checkout selectedProducts={selectedProducts} selectedStores={selectedStores} onReset={handleReset} />
        </>
    );
};

export default Orders;