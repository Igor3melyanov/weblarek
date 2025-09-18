import { IApi, IApiResponse, IOrderRequest, IOrderResponse, IProduct } from "../../types";

export class WebLarekApi {
    private api: IApi;

   constructor(api: IApi) {
        this.api = api;
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            const response: IApiResponse = await this.api.get<IApiResponse>('/product/');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении каталога товаров:', error);
            throw error;
        }
    }

    async submitOrder(order: IOrderRequest): Promise<IOrderResponse> {
        try {
            return await this.api.post<IOrderResponse>('/order/', order);
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}