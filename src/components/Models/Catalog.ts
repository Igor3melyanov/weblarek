import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Catalog {
    catalog: IProduct[];
    currentProduct: IProduct;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.catalog = [];
        this.currentProduct = {
            id: '',
            category: '',
            title: '',
            description: '',
            image: '',
            price: null
        };
        this.events = events;
    };

    getCatalog(): IProduct[] {
        return this.catalog
    };
    setCatalog(catalog: IProduct[]): void {
        this.catalog = catalog;
        this.events.emit('catalog:changed', {catalog: this.catalog});
    };
    getCardProduct(): IProduct {
        return this.currentProduct;
    };
    setCardProduct(currentProduct: IProduct): void {
        this.currentProduct = currentProduct;
        this.events.emit('product:selected', {product: this.currentProduct});
    };
}