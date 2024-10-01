import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import css from './style.module.css'
const Checkout = ({ selectedProducts, selectedStores, onReset }) => {
    const toast = useRef(null);

    if (!selectedProducts || selectedProducts.length === 0) {
        return (
            <div className="checkout">
                <h3>Захиалга</h3>
                <p>Та бараа сонгоогүй байна.</p>
            </div>
        );
    }

    const total = selectedProducts.reduce((sum, product) => {
        return sum + (product.price * product.orderQuantity);
    }, 0);

    const onSavetoDb = async () => {
        const validProducts = selectedProducts.every(product => product.orderQuantity > 0 && product.quantity >= product.orderQuantity);
        if (validProducts) {
            console.log("Submitting order with customerId:", selectedStores.id);
            const orderData = {
                customerId: selectedStores.id,
                status: 'pending',
                selectedProducts,
            }
            try {
                const response = await fetch("http://localhost:5000/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Захиалга амжилттай.', life: 2000 });
                    console.log("Order placed successfully!");
                    setTimeout(onReset, 2000);

                } else {
                    console.error("Failed to place order.");
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Захиалга амжилтгүй.', life: 2000 });
                }
            } catch (err) {
                console.error(err.message);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Сүлжээний алдаа.', life: 2000 });
            }
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Алдаа гарлаа', life: 2000 });
        }
    }

    return (
        <div className="checkout">
            <h3>Захиалга</h3>
            <Toast ref={toast} />
            <ul className={css.listItems}>
                {selectedProducts.map(product => (
                    <li key={product.id}>
                        {product.name}: {product.orderQuantity} ширхэг (Нэгж үнэ: {product.price})
                    </li>
                ))}
            </ul>
            <p><b>Нийт үнэ:</b> {total}</p>
            <p><b>Хүргэх дэлгүүр:</b> {selectedStores?.name ?? 'Та дэлгүүрээ сонгоогүй байна.'}</p>
            <Button className='mb-4' label="Захиалах" severity="secondary" outlined onClick={onSavetoDb} />
        </div>
    );
};

export default Checkout;
