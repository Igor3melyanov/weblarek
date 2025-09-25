export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    category: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
}

export interface ICustomer {
    payments: 'cash' | 'card' | '';
    address: string;
    email: string;
    phone: string;
}

export interface IApiResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderRequest{
    payment: 'cash' | 'card';
    email: string;
    phone: string;
    address: string;total: number;
    items: string[]; // массив ID товаров
}

export interface IOrderResponse {
    id: string;
    total: number;
}