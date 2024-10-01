import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from "primereact/checkbox";
import { Toast } from 'primereact/toast';

import ProductService from '../services/productService';

const OrderTable = ({ onSelectionChange, resetTrigger }) => {
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [orderQuantities, setOrderQuantities] = useState({});

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/products");
                const jsonData = await response.json();
                setProducts(jsonData);
            }
            catch (err) {
                console.log(err.message);
            }
        };

        getProducts();
    }, []);
    const toast = useRef(null);
    // useEffect(() => {
    //     getProducts();
    // }, []);

    useEffect(() => {
        setSelectedProducts({});
        setOrderQuantities({});
        onSelectionChange([]);
    }, [resetTrigger, onSelectionChange]);


    // useEffect(() => {
    //     ProductService.getProductsMini().then((data) => setProducts(data));
    // }, []);

    const categories = ProductService.getCategories(products);
    const groupedProducts = ProductService.groupProductsByCategory(products);

    const onOrderQuantityChange = (product, value) => {
        if (product.quantity >= value && 0 <= value) {
            setOrderQuantities(prevOrderQuantities => ({
                ...prevOrderQuantities,
                [product.id]: Number(value),
            }));

            setSelectedProducts(prevSelectedProducts => {
                const updatedSelectedProducts = { ...prevSelectedProducts };
                if (updatedSelectedProducts[product.id]) {
                    updatedSelectedProducts[product.id].orderQuantity = Number(value);
                }
                onSelectionChange(Object.values(updatedSelectedProducts));
                return updatedSelectedProducts;
            });
        }
        else {
            toast.current.show({ severity: 'warn', summary: 'Санамж', detail: 'Агуулахын нөөцөөс хэтэрсэн байна.', life: 1000 })
        }
    };


    const onCheckboxChange = (product, checked) => {

        setSelectedProducts(prevSelectedProducts => {
            const updatedSelectedProducts = { ...prevSelectedProducts };
            if (checked) {
                updatedSelectedProducts[product.id] = {
                    ...product,
                    orderQuantity: orderQuantities[product.id] || 1,
                };
            } else {
                delete updatedSelectedProducts[product.id];
            }
            onSelectionChange(Object.values(updatedSelectedProducts));
            return updatedSelectedProducts;
        });
        setOrderQuantities(prevOrderQuantities => {
            const updatedOrderQuantities = { ...prevOrderQuantities };
            if (checked) {
                updatedOrderQuantities[product.id] = orderQuantities[product.id] || 1;
            } else {
                delete updatedOrderQuantities[product.id];
            }
            return updatedOrderQuantities;
        });
    };

    const rowExpansionTemplate = (data) => {
        const categoryProducts = groupedProducts[data.category] || [];
        return (
            <div className="p-3">
                <h5>Products in {data.category}</h5>
                <Toast ref={toast} />
                <DataTable value={categoryProducts} dataKey="id" tableStyle={{ minWidth: '40rem' }}
                    paginator rows={4} rowsPerPageOptions={[4, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column
                        body={(product) => (
                            <Checkbox
                                inputId={`cb-${product.id}`}
                                checked={!!selectedProducts[product.id]}
                                onChange={(e) => onCheckboxChange(product, e.checked)}
                            />
                        )}
                        style={{ width: '3em' }}
                    />
                    <Column field="name" header="Нэр" />
                    <Column field="price" header="Үнэ" />

                    <Column field="quantity" header="Тоо хэмжээ" />
                    <Column
                        header="Захиалгын тоо"
                        body={(product) => (
                            <input
                                type="number"
                                value={orderQuantities[product.id] || 0}
                                onChange={(e) => onOrderQuantityChange(product, e.target.value)}
                                style={{ width: '50%', padding: '7px 0px', textAlign: 'center', border: '1px solid #d5d5d5 ', borderRadius: '5px' }}
                            />
                        )}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="card">
            <DataTable
                value={categories}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                tableStyle={{ minWidth: '20rem' }}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="category" header="Ангилал" />
            </DataTable>
        </div>
    );
};

export default OrderTable;
