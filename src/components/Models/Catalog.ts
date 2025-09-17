import { IProduct } from "../../types";

export class Catalog {
    catalog: IProduct[];
    currentProduct: IProduct;

    constructor(catalog: IProduct[], currentProduct: IProduct) {
        this.catalog = catalog;
        this.currentProduct = currentProduct;
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