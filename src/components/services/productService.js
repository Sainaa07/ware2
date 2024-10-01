// src/services/ProductService.js

const ProductService = {
    // Method to simulate fetching product data
    // getProductsMini() {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             const products = [
    //                 { id: 1, name: 'Pepsi', quantity: 150, price: 5000, category: 'Soda' },
    //                 { id: 2, name: 'Sprite', quantity: 120, price: 4000, category: 'Soda' },
    //                 { id: 3, name: 'Cola', quantity: 200, price: 6000, category: 'Soda' },
    //                 { id: 4, name: 'Fanta', quantity: 80, price: 4200, category: 'Soda' },
    //                 { id: 5, name: 'Mountain Dew', quantity: 90, price: 4500, category: 'Soda' },
    //                 { id: 6, name: 'Orange Juice', quantity: 100, price: 5100, category: 'Juice' },
    //                 { id: 7, name: 'Apple Juice', quantity: 80, price: 5500, category: 'Juice' },
    //                 { id: 8, name: 'Grape Juice', quantity: 120, price: 7000, category: 'Juice' },
    //                 { id: 9, name: 'Lemonade', quantity: 90, price: 8000, category: 'Juice' },
    //             ];
    //             resolve(products);
    //         }, 1000);
    //     });
    // },
    // getProductsMini(){
    //     const getProducts = async () =>{
    //         try{
    //             const response = await fetch("http://localhost:5000/products");
    //             const jsonData = await response.json();
    //             console.log(jsonData);
    //         }
    //         catch(err){
    //             console.log(err.message);
    //         }
    //     }
    // },

    groupProductsByCategory(products) {
        return products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {});
    },


    getCategories(products) {
        const groupedProducts = this.groupProductsByCategory(products);
        return Object.keys(groupedProducts).map((category, index) => ({
            id: index + 1,
            category,
        }));
    }
};

export default ProductService;
