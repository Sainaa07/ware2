import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';

const StoreChecker = ({ onSelectionChange, resetTrigger }) => {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);

    const getCustomers = async () => {
        try {
            const response = await fetch("http://localhost:5000/customers");
            const jsonData = await response.json();
            setStores(jsonData);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getCustomers();
    }, []);

    useEffect(() => {
        setSelectedStore(null);
    }, [resetTrigger]);


    const onDropDownChange = (e) => {
        const selected = e.value;
        setSelectedStore(selected);
        onSelectionChange(e.value);
    };

    return (
        <>
            <h4>Харилцагчаа сонгоно уу</h4>
            <Dropdown
                value={selectedStore}
                onChange={onDropDownChange}
                options={stores}
                optionLabel="name"
                placeholder="Дэлгүүр сонгох"
                className="w-full md:w-14rem"
            />
            <br />
            <br />
        </>
    );
};

export default StoreChecker;
