import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Basket {
    protected basket: IProduct[];
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.basket = [];
        this.events = events;
    };

    getBasketProducts(): IProduct[] {
        return this.basket;
    };
    addProductToBasket(product: IProduct): IProduct[] {
        if (product.price !== null && product.price !== undefined) {
            if (!this.checkProductInBasket(product.id)) { 
                this.basket.push(product);
                this.events.emit('basket:changed', {basket: this.basket});
            } 
        }
        return this.basket; 
    };
    deleteProductFromBasket(id: IProduct['id']): IProduct[] {
        this.basket = this.basket.filter((product) => product.id !== id);
        this.events.emit('basket:changed', {basket: this.basket});
        return this.basket;
    };
    clearBasket(): IProduct[] {
        this.events.emit('basket:changed', {basket: this.basket});
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