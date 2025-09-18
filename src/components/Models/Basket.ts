import { IProduct } from "../../types";

export class Basket {
    protected basket: IProduct[];

    constructor() {
        this.basket = [];
    };

    getBasketProducts(): IProduct[] {
        return this.basket;
    };
    addProductToBasket(product: IProduct): IProduct[] {
        if (product.price !== null && product.price !== undefined) {
            if (!this.checkProductInBasket(product.id)) { 
                this.basket.push(product); 
            } 
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
            return total + (product.price as number);
        }, 0);
    };
    getTotalProducts(): number {
        return this.basket.length;
    };
    checkProductInBasket(id: IProduct['id']): boolean {
        return this.basket.some((product) => product.id === id);
    };
}