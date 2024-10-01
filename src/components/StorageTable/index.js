import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import ProductService from "../services/productService";
import { Dialog } from "primereact/dialog";
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";

const StorageTable = () => {


    let emptyProduct = {
        id: null,
        name: '',
        price: 0,
        category: null,
        quantity: 0,
    };

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const getProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products");
            const jsonData = await response.json();
            setProducts(jsonData);
        }
        catch (err) {
            console.log(err.message);
        };

    }
    useEffect(() => {
        getProducts();
    });

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async () => {
        let _products = products.filter((val) => val.id !== product.id);
        console.log('hi' + product.id);
        try {
            const deleteProduct = await fetch(`http://localhost:5000/product/${product.id}`, {
                method: "DELETE"
            });
            console.log(deleteProduct);
        }
        catch (err) {
            console.error(err.message);
        }
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 1000 });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);
                _products[index] = _product;
                try {
                    await fetch(`http://localhost:5000/product/${product.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(_product)
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                _product.id = createId();
                _products.push(_product);
                try {
                    const response = await fetch("http://localhost:5000/product", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(_product)
                    });
                    console.log(response);
                } catch (err) {
                    console.error(err);
                }
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const categories = ProductService.getCategories(products);
    const groupedProducts = ProductService.groupProductsByCategory(products);


    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon='pi pi-pencil' rounded outlined className="mr-2" onClick={() => editProduct(rowData)} ></Button>
                <Button icon='pi pi-trash' rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)}  ></Button>
            </>
        )
    }
    const rowExpansionTemplate = (data) => {
        const categoryProducts = groupedProducts[data.category] || [];
        return (
            <div className="p-3">
                <h5>Products in {data.category}</h5>
                <DataTable value={categoryProducts} dataKey="id" tableStyle={{ minWidth: '20rem' }}
                    paginator rows={4} rowsPerPageOptions={[4, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column field="name" header="Нэр" />
                    <Column field="price" header="Үнэ" />
                    <Column field="quantity" header="Тоо хэмжээ" />
                    <Column field="Засварлах" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
        );
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />
            <Button label="Бараа нэмэх" icon="pi pi-plus" severity="info" text raised style={{ padding: '10px 10px', fontSize: '0.9rem' }
            } className="mb-4" onClick={openNew} />
            <DataTable
                value={categories}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                tableStyle={{ minWidth: '55rem' }}
            >
                <Column expander style={{ width: '3em' }} />
                <Column field="category" header="Ангилал" />
            </DataTable>




            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Барааны мэдээлэл" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Нэр
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Ангилал</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Soda" onChange={onCategoryChange} checked={product.category === 'Soda'} />
                            <label htmlFor="category1">Soda</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Juice" onChange={onCategoryChange} checked={product.category === 'Juice'} />
                            <label htmlFor="category2">Juice</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Үнэ
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="Mnt" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Тоо хэмжээ
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
            </Dialog>
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Баталгаажуулах" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Та <b>{product.name}</b> барааг устгах гэж байна ?
                        </span>
                    )}
                </div>
            </Dialog>

        </>
    );
}
export default StorageTable;