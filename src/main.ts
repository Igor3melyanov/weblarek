import { Basket } from './components/Models/Basket';
import { Catalog } from './components/Models/Catalog';
import { Customer } from './components/Models/Customer';
import { WebLarekApi } from './components/Models/WeblarekAPI';
import './scss/styles.scss';
import { ICustomer, IOrderRequest } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalog = new Catalog(apiProducts.items, apiProducts.items[2]);
console.log(catalog);

const basket = new Basket([]);
basket.addProductToBasket(catalog.currentProduct);
basket.addProductToBasket(catalog.catalog[1]);
console.log(basket);
console.log(basket.getTotalSum());
console.log(basket.getTotalProducts());
basket.deleteProductFromBasket(catalog.currentProduct.id);
console.log(basket);
console.log(basket.checkProductInBasket(catalog.currentProduct.id));
console.log(basket.checkProductInBasket(catalog.catalog[3].id));
basket.clearBasket();
console.log(basket);


const testCustomerInfo: ICustomer = {
    payments: 'card',
    address: 'ул. Пушкина, д. 15',
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67'
};

const customer = new Customer(testCustomerInfo);
console.log(customer);
console.log(customer.getCustomerInfo());
console.log(customer.checkValidityForms());
customer.clearCustomerInfo();
console.log(customer);

const api = new WebLarekApi(API_URL);

async function testApi() {
    try {
        const productsFromServer = await api.getProductList();
        
        console.log('Товары полученые с сервера:', productsFromServer);
        
        catalog.setCatalog(productsFromServer);
        console.log(catalog.getCatalog());
        
        basket.addProductToBasket(productsFromServer[0]);
        basket.addProductToBasket(productsFromServer[1]);
        console.log(basket.getBusketProducts());
        console.log(basket.getTotalSum());
        console.log(basket.getTotalProducts());

        const customerTest = new Customer(testCustomerInfo);
        const customerInfo = customerTest.getCustomerInfo();
        
        const order: IOrderRequest = {
            payment: customerInfo.payments === 'card' || customerInfo.payments === 'cash' ? customerInfo.payments : 'card', 
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
            total: basket.getTotalSum(),
            items: basket.getBusketProducts().map(product => product.id)
        };
        console.log('Данные для заказа', order);

        if (order.items.length === 0) {
            console.error('Корзина пуста');
            return;
        }
        
        const orderResponse = await api.submitOrder(order);
        console.log('Заказ:', orderResponse);
        
    } catch (error) {
        console.error('Ошибка при работе с API:', error);
    }
}

testApi();