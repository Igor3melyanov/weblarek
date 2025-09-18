import { IProduct } from "../../types";

export class Catalog {
    catalog: IProduct[];
    currentProduct: IProduct;

    constructor() {
        this.catalog = [];
        this.currentProduct = {
            id: '',
            category: '',
            title: '',
            description: '',
            image: '',
            price: null
        };
    };

    getCatalog(): IProduct[] {
        return this.catalog
    };
    setCatalog(catalog: IProduct[]): void {
        this.catalog = catalog;
    };
    getCardProduct(): IProduct {
        return this.currentProduct;
    };
    setCardProduct(currentProduct: IProduct): void {
        this.currentProduct = currentProduct;
    };
}