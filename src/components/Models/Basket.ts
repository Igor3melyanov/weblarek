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
    addProductToBasket(product: IProduct): void {
        if (product.price !== null && !this.checkProductInBasket(product.id)) {
            this.basket.push(product);
            this.events.emit('basket:changed');
        } 
    };
    deleteProductFromBasket(id: IProduct['id']): void {
        this.basket = this.basket.filter((product) => product.id !== id);
        this.events.emit('basket:changed');
    };
    clearBasket(): void {
        this.basket = [];
        this.events.emit('basket:changed');
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