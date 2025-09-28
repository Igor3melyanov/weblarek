import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/Models/Basket';
import { Catalog } from './components/Models/Catalog';
import { Customer } from './components/Models/Customer';
import { WebLarekApi } from './components/Models/WeblarekAPI';
import { BasketModal } from './components/View/BasketModal';
import { BasketCard, CatalogCard, PreviewCard } from './components/View/Card';
import { ContactsForm, DeliveryForm } from './components/View/Form';
import { Gallery } from './components/View/Gallery';
import { HeaderBasket } from './components/View/HeaderBasket';
import { Modal } from './components/View/Modal';
import { SuccessMessage } from './components/View/SuccessMessage';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const catalogModel = new Catalog(events);
const basketModel = new Basket(events);
const customerModel = new Customer(events);
const gallery = new Gallery(events, ensureElement<HTMLElement>('.gallery'));
const headerBasket = new HeaderBasket(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'))

const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketModal = new BasketModal(events, cloneTemplate(basketTemplate));
const deliveryForm = new DeliveryForm(events, cloneTemplate(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplate));
const successMessage = new SuccessMessage(events, cloneTemplate(successTemplate));

let activeForm: 'delivery' | 'contacts' | null = null;

async function loadProducts() {
    try {
        const productsFromServer = await weblarekApi.getProductList();
        
        console.log('Товары полученые с сервера:', productsFromServer);
        
        catalogModel.setCatalog(productsFromServer);
        console.log(catalogModel.getCatalog());
    } catch (error) {
        console.error('Ошибка при работе с API:', error);
    }
}

function handleCatalogChange(data: { catalog: any }): void {
    const cards = data.catalog.map((item: any) => {
        const card = new CatalogCard(events, cloneTemplate(cardCatalogTemplate));
        return card.render({
            id: item.id,
            title: item.title,
            image: CDN_URL + item.image,
            category: item.category,
            price: item.price,
            description: item.description
        });
    });
    gallery.catalog = cards;
}

function handleProductSelect(data: { product: any }): void {
    const product = data.product;
    const previewCard = new PreviewCard(events, cloneTemplate(cardPreviewTemplate));
    const inBasket = basketModel.checkProductInBasket(product.id);
    
    const cardElement = previewCard.render({
        id: product.id,
        title: product.title,
        image: CDN_URL + product.image,
        category: product.category,
        price: product.price,
        description: product.description,
        inBasket: inBasket
    });

    modal.content = cardElement;
    modal.open();
}


function handleBasketChange(): void {
    headerBasket.counter = basketModel.getTotalProducts();
    renderBasketModal();
}

function handleOrderChange(data: { field: string; value: any }): void {
    switch (data.field) {
        case 'payment':
            customerModel.setPayment(data.value);
            break;
        case 'address':
            customerModel.setAddress(data.value);
            break;
        case 'email':
            customerModel.setEmail(data.value);
            break;
        case 'phone':
            customerModel.setPhone(data.value);
            break;
    }
}

function handleFormErrors(data: { errors: Record<string, string> }): void {
    if (activeForm === 'delivery') {
        const isDeliveryValid = !data.errors.payments && !data.errors.address;
        deliveryForm.valid = isDeliveryValid;
        deliveryForm.errors = [data.errors.payments || '', data.errors.address || ''];
    } else if (activeForm === 'contacts') {
        const isContactsValid = !data.errors.email && !data.errors.phone;
        contactsForm.valid = isContactsValid;
        contactsForm.errors = [data.errors.email || '', data.errors.phone || ''];
    }
}

function handleCardSelect(data: { target: HTMLElement }): void {
    const productId = data.target.dataset.id;
    if (!productId) return;
    const product = catalogModel.getCatalog().find(item => item.id === productId);
    if (product) {
        catalogModel.setCardProduct(product);
    }
}

function handleCardToggle(): void {
    const product = catalogModel.getCardProduct();
    if (!product) return;
    
    if (basketModel.checkProductInBasket(product.id)) {
        basketModel.deleteProductFromBasket(product.id);
    } else {
        basketModel.addProductToBasket(product);
    }
    modal.close();
}

function handleBasketOpen(): void {
    modal.content = basketModal.render();
    modal.open();
}

function handleBasketRemove(data: { id: string }): void {
    basketModel.deleteProductFromBasket(data.id);
}

function handleOrderOpen(): void {
    if (basketModel.getTotalProducts() > 0) {
        const formElement = deliveryForm.render({
            payment: customerModel.payments as 'card' | 'cash',
            address: customerModel.address
        });
        
        modal.content = formElement;
        activeForm = 'delivery';
    }
}

function handleDeliverySubmit(): void {
    const errors = customerModel.checkValidityForms();
    const isDeliveryValid = !errors.payments && !errors.address;
    
    if (isDeliveryValid) {
        const formElement = contactsForm.render({
            email: customerModel.email,
            phone: customerModel.phone
        });
        modal.content = formElement;
        activeForm = 'contacts';
    } else {
        console.log('Форма доставки содержит ошибки:', errors);
    }
}

async function handleContactsSubmit(): Promise<void> {
    const errors = customerModel.checkValidityForms();
    const isOrderValid = !errors.payments && !errors.address && !errors.email && !errors.phone;
    
    if (isOrderValid) {
        contactsForm.valid = false;
        
        try {
            const orderData = {
                payment: customerModel.payments as 'cash' | 'card',
                address: customerModel.address,
                email: customerModel.email,
                phone: customerModel.phone,
                total: basketModel.getTotalSum(),
                items: basketModel.getBasketProducts().map(item => item.id)
            };
            
            const result = await weblarekApi.submitOrder(orderData);
            const successElement = successMessage.render({
                total: result.total
            });
            
            basketModel.clearBasket();
            customerModel.clearCustomerInfo();
            modal.content = successElement;
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            contactsForm.valid = true;
        }
    } else {
        console.log('Форма содержит ошибки:', errors);
    }
}

function handleModalClose(): void {
    modal.close();
    activeForm = null;
}

function renderBasketModal(): void {
    const basketItems = basketModel.getBasketProducts().map((item, index) => {
        const basketCard = new BasketCard(events, cloneTemplate(cardBasketTemplate));
        return basketCard.render({
            id: item.id,
            title: item.title,
            price: item.price as number,
            index: index + 1
        });
    });

    const basketElement = basketModal.render({
        items: basketItems,
        total: basketModel.getTotalSum(),
        valid: basketModel.getTotalProducts() > 0
    });

    modal.content = basketElement;
}

function setupEventListeners(): void {
    events.on('catalog:changed', handleCatalogChange);
    events.on('product:selected', handleProductSelect);
    events.on('basket:changed', handleBasketChange);
    events.on('form:errors', handleFormErrors);
    events.on('order:change', handleOrderChange);
    events.on('card:select', handleCardSelect);
    events.on('card:toggle', handleCardToggle);
    events.on('basket:open', handleBasketOpen);
    events.on('basket:remove', handleBasketRemove);
    events.on('order:open', handleOrderOpen);
    events.on('delivery:submit', handleDeliverySubmit);
    events.on('contacts:submit', handleContactsSubmit);
    events.on('modal:close', handleModalClose);
    events.on('success:close', handleModalClose);
}

async function initApp(): Promise<void> {
    setupEventListeners();
    await loadProducts();
}

initApp();