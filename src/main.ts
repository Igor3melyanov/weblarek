import { Api } from './components/base/Api';
import { Basket } from './components/Models/Basket';
import { Catalog } from './components/Models/Catalog';
import { Customer } from './components/Models/Customer';
import { WebLarekApi } from './components/Models/WeblarekAPI';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalog = new Catalog();

const basket = new Basket();

catalog.setCatalog(apiProducts.items);
console.log(catalog.getCatalog());
catalog.setCardProduct(apiProducts.items[1]);
console.log('Текущий продукт:', catalog.getCardProduct());

const productToAdd = catalog.getCardProduct();
if (productToAdd.price !== null) {
    basket.addProductToBasket(productToAdd);
    console.log(basket.getBasketProducts());
};
console.log(basket.checkProductInBasket(apiProducts.items[1].id));

console.log('Общая сумма:', basket.getTotalSum());
console.log('Товаров в корзине:', basket.getTotalProducts());

if (productToAdd.id) {
    basket.deleteProductFromBasket(productToAdd.id);
    console.log(basket.getBasketProducts());
}
console.log(basket.checkProductInBasket(apiProducts.items[1].id));

basket.clearBasket();
console.log(basket.getBasketProducts());

const customer = new Customer();
customer.setCustomerInfo({address: 'ул. Пушкина, д. 15', phone: '+7 (999) 123-45-67'});
console.log(customer.getCustomerInfo());
console.log(customer.checkValidityForms());
customer.setCustomerInfo({payments: 'card', email: 'test@example.com'});
console.log(customer.getCustomerInfo());
console.log(customer.checkValidityForms());
customer.clearCustomerInfo();
console.log(customer);

const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

async function testApi() {
    try {
        const productsFromServer = await weblarekApi.getProductList();
        
        console.log('Товары полученые с сервера:', productsFromServer);
        
        catalog.setCatalog(productsFromServer);
        console.log(catalog.getCatalog());
    } catch (error) {
        console.error('Ошибка при работе с API:', error);
    }
}

testApi();