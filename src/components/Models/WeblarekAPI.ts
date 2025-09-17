import { ApiPostMethods, IApi, IApiResponse, IOrderRequest, IOrderResponse, IProduct } from "../../types";
import { Api } from "../base/Api";

export class WebLarekApi implements IApi {
    private api: Api;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.api = new Api(baseUrl, options);
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            const response: IApiResponse = await this.api.get('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении каталога товаров:', error);
            throw error;
        }
    }

    async submitOrder(order: IOrderRequest): Promise<IOrderResponse> {
        try {
            return await this.api.post('/order/', order);
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }

    get<T extends object>(uri: string): Promise<T> {
        return this.api.get<T>(uri);
    }

    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> {
        return this.api.post<T>(uri, data, method);
    }
}