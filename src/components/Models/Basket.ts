import { IProduct } from "../../types";

export class Basket {
    basket: IProduct[];

    constructor(basket: IProduct[]) {
        this.basket = basket;
    };

    getBusketProducts(): IProduct[] {
        return this.basket;
    };
    addProductToBasket(product: IProduct): IProduct[] {
        if (!this.checkProductInBasket(product.id)) {
            this.basket.push(product);
        }
        return this.basket;
    };
    deleteProductFromBasket(id: IProduct['id']): IProduct[] {
        this.basket = this.basket.filter((product) => product.id !== id);
        return this.basket;
    };
    clearBasket(): IProduct[] {
        return this.basket = [];
    };
    getTotalSum(): number {
        return this.basket.reduce((total, product) => {
            return total + (product.price || 0);
        }, 0);
    };
    getTotalProducts(): number {
        return this.basket.length;
    };
    checkProductInBasket(id: IProduct['id']): boolean {
        return this.basket.some((product) => product.id === id);
    };
}