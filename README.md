# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные
### Интерфейсы
#### Интерфейс товара `IProduct`:
Отвечает за хранение ингформации о товаре.
Поля:
- id: string;
- category: string;
- title: string;
- description: string;
- image: string;
- price: number | null;

#### Интерфейс покупателя `ICustomer`:
Отвечает за хранение данных о покупаетеле.
Поля:
- payments: 'cash' | 'card' | '';
- adress: string;
- email: string;
- phone: string;

#### Интерфейс данных для отправки заказа `IOrderRequest`:
- payment: 'card' | 'cash';
- email: string;
- phone: string;
- address: string;
- total: number;
- items: string[]; (массив ID товаров)

#### Интерфейс ответф от сервера о заказе `IOrderResponse`:
- id: string;
- total: number;

#### Интерфейс ответа сервера с каталогом товаров `IApiResponse`:
- total: number;
- items: IProduct[];

### Модели данных
#### Класс каталога товаров `Catalog`:
Хранит массив карточек товаров и  информацию о выбранной карточке товара. Позволяет: получить и сохранить массив карточек товаров; получить и сохранить товар для отображения.
Поля:
- catalog: IProduct[];
- currentProduct: IProduct;
Методы:
- getCatalog(): IProduct[];
- setCatalog(): void;
- getCardProduct(): IProduct;
- setCardProduct(): void;
#### Класс корзины с товарами `Basket`:
Хранит массив товаров, выбранных для покупки. Позволяет: получить массив товаров, находящихся в корзине; добавить товар в корзину; удалить товар из корзины; очистить корзину после оформления заказа; получить общую стоимость товаров в корзине; получить общее число товаров в корзине; проверить наличие товара в корзине по его id.
Поля:
- busket: IProduct[];
Методы:
- getBusketProducts(): IProduct[];
- addProductToBusket(id: Iproduct['id']): IProduct[];
- deleteProductFromBusket(id: IProduct['id']): IProduct[];
- clearBusket(): [];
- getTotalSum(): number;
- getTotalProducts(): number;
- checkProductInBusket(id: IProduct['id']): boolean;
#### Класс покупателя `Customer`:
Хранит данные о покупателе, наследует интерфейс `ICustomer`. Позволяет: сохранять данные покупателя; получать данные покупателя; валидация форм; очистка данных.
Поля:
- payments: 'cash' | 'card' | '';
- adress: string;
- email: string;
- phone: string;
Методы:
- setCustomerInfo(info: ICustomer): void;
- getCustomerInfo(): ICustomer;
- checkValidityForms(): boolean;
- clearCustomerInfo(): void;

## Слой коммуникации
### Класс `WebLarekApi`:
Отвечает за взаимодействие с API сервера "Веб-ларёк". Использует композицию с классом `Api` для выполнения HTTP-запросов. Позволяет: получать каталог товаров с сервера; отправлять заказ на сервер;
Методы:
- getProductList(): Promise<IProduct[]>
- submitOrder(order: IOrderRequest): Promise<IOrderResponse>
- get<T>(uri: string): Promise<T>
- post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>

## Слой представления
### Интерфейс IHeaderBasket:
- counter: number;
### Класс `HeaderBasket`:
Предоставляет информацию о количестве товаров в корзине. Наследует класс `Component<IHeaderBasket>`.
Поля: 
- counterElement: HTMLElement;
- openBsketModal: HTMLButtonElement;
Методы:
- set counter(value: number);

### Интерфейс IGallery:
- catalog: HTMLElement
### Класс `Gallery`:
Отображает каталог товаров. Наследует класс `Component<IGallery>`.
Поля:
- catalogElement: HTMLElement[];
Методы:
- set catalog(items: HTMLElement[]);

### Интерфейс IModal:
- content: HTMLElement;
### Класс `Modal`:
Предоставляет контейнер - модальное окно. Наследует класс `Component<IModal>`.
Поля:
- closeModal: HTMLButtonElement;
- modalContent: HTMLElement;
Методы:
- set content(HTMLElemenmt);

### Интерфейс IBsketModal:
- basketItems: HTMLElement[];
- totalPrice: HTMLElement;
### Класс `BasketModal`:
Отображает список добавленных товаров в корзину и оющую стоимость товаров. Наследуте класс `Component<IBasketModal>`.
Поля:
- makeAnOrderButton: HTMLButtonElement;
- totalPriceElement: HTMLElement;
Методы:
- set basketItems(HTMLElemnt[]);
- set totalPrice(value: number);

### Класс `Card`:
Базовый класс для всех типов карточек товаров. Наследует класс `Component<T>`.
Поля:
- buttonElement: HTMLButtonElement;
- priceElement: HTMLElement;
Методы:
- ser id(value: string);
- set price(value: number | null);
- set category(value: string);
- set image(value: string);
- set title(value: string);
- set description(value: string);
- set buttonText(value: string);

### Интерфейс ICatalogCard:
- id: string
- category: string;
- description: string;
- image: string;
- price: number | null;
### Класс `CatalogCard`:
Карточка товара для отображения в каталоге. Наследует класс `Card<ICatalogCard>`.
### Интерфейс IPreviewCard:
- id: string;
- category: string;
- title: string;
- description: string;
- image: string;
- price: number | null;
- inBasket: boolean
### Класс `PreviewCard`:
Карточка товара для просмотра в модальном окне. Наследует класс `Card<IPreviewCard>`.
Методы:
- set inBasket(value: boolean);
### Интерфейс IBasketCard:
- id: string;
- title: string;
- price: number;
- index: number;
### Класс `BasketCard`:
Карточка товара для отображения в корзине. Наследует класс `Card<IBasketCard>`.
Методы:
- set cardIndex(value: number);

### Класс `Form`:
Базовый класс для всех форм в приложении. Наследует класс `Component<T>`.
Поля:
- formButtonElemnet: HTMLButtonElement;
- errors: HTMLElement;
Методы:
- set valid(value: boolean);
- set errors(value: string[]);
- clearForm(): void;

### Интерфейс IDeliveryForm:
- payment: 'card' | 'cash';
- address: string;
### Класс `DeliveryForm`:
Форма данных доставки. Наследует класс `Form<IDelivery>`
Поля:
- addressInput: HTMLInputElement;
- paymentButtons: HTMLButtonElement[];
- nextButton: HTMLButtonElement;
Методы:
- set address(value: string);
- set payment(value: 'card' | 'cash');
- set aktiveNextButton(value: boolean);
### Интерфейс IContactsForm:
- email: string;
- phone: string;
### Класс `ContactsForm`:
Форма контактных данных покупателя. Наследует класс `Form<IContacts>`.
Поля:
- emailInput: HTMLInputElement;
- phoneInput: HTMLInputElement;
- payButton: HTMLButtonElement;
Методы:
- set aktivePayButton(value: boolean);

### Интерфейс ISuccessMessage:
- total: number;
### Класс `SuccessMessage`:
Сообщение об успешном оформлении заказа. Наследует класс `Component<ISuccess>`.
Поля:
- reloadWebsiteButton: HTMLButtonElement;
Методы:
- set total(value: number);

## События приложения
### События корзины
- `basket:open` - открытие корзины;
- `basket:remove` - удаление товара из корзины;
### События карточек товаров
- `card:select` - выбор карточки товара для просмотра;
- `card:toggle` - добавление/удаление товара в корзину;
### События модальных окон
- `modal:open` - открытие модального окна;
- `modal:close` - закрытие модального окна;
### События форм
- `order:input` - ввод данных в форму заказа;
- `order:submit` - отправка формы заказа;
- `contacts:input` - ввод данных в форму контактов;
- `contacts:submit` - отправка формы контактов;
- `order.payment:change` - изменение способа оплаты;
### События успешного заказа
- `success:close` - закрытие окна успешного заказа;

## Презентер

В приложении "Web-Larёk" презентер реализован в виде набора функций-обработчиков в файле main.ts, которые координируют взаимодействие между моделями данных и представлениями согласно парадигме MVP.

### Архитектура:

- Инициализация компонентов - создание экземпляров моделей и представлений при запуске приложения
- Настройка событийной системы - подписка на события через EventEmitter
- Обработчики событий - чистые функции, реагирующие на изменения данных и действия пользователя

### Ключевые функции:

- handleCatalogChange() - обработка изменения каталога товаров, рендер карточек
- handleProductSelect() - открытие модального окна с деталями товара
- handleCardToggle() - добавление/удаление товаров из корзины
- handleBasketChange() - обновление счетчика корзины в заголовке
- handleDeliverySubmit() - валидация и переход к форме контактов
- handleContactsSubmit() - финальная валидация и отправка заказа на сервер
- handleCustomerChange() - динамическое обновление валидации форм

### Презентер отвечает за:
- Координацию между Model и View
- Обработку бизнес-логики приложения
- Валидацию данных перед отправкой на сервер
- Управление состоянием UI (открытие/закрытие модальных окон)