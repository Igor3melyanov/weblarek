import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { categoryMap } from "./Constants";

export class Card<T> extends Component<T> {
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
    };

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set price(value: number | null) {
        const priceElement = this.container.querySelector('.card__price');
        if (priceElement) {
            if (value === null) {
                priceElement.textContent = 'Бесценно';
            } else {
                priceElement.textContent = `${value} синапсов`;
            }
        }
    }

    set category(value: string) {
        const categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        categoryElement.textContent = value;
        
        Object.values(categoryMap).forEach(className => {
            categoryElement.classList.remove(className);
        });
        
        if (categoryMap[value]) {
            categoryElement.classList.add(categoryMap[value]);
        }
    }

    set image(value: string) {
        const imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.setImage(imageElement, value, this.container.title);
    }

    set title(value: string) {
        const titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        titleElement.textContent = value;
    }

    set description(value: string) {
        const descriptionElement = this.container.querySelector('.card__text');
        if (descriptionElement) {
            descriptionElement.textContent = value;
        }
    }

    set buttonText(value: string) {
        const buttonElement = this.container.querySelector('.card__button');
        if (buttonElement instanceof HTMLButtonElement) {
            buttonElement.textContent = value;
        }
    }
}

export interface ICatalogCard {
    id: string
    category: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
}

export class CatalogCard extends Card<ICatalogCard> {
    protected buttonElement: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.buttonElement = this.container as HTMLButtonElement;
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:select', { target: this.container });
        });
    }
}

export interface IPreviewCard {
    id: string;
    category: string;
    title: string;
    description: string;
    image: string;
    price: number | null;
    inBasket: boolean
}

export class PreviewCard extends Card<IPreviewCard> {
    protected buttonElement: HTMLButtonElement | null;
    protected priceElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:toggle', {target: this.container});
        });
    }

    set inBasket(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value ? 'Убрать из корзины' : 'В корзину';
        }
    }

    set price(value: number | null) {
        const priceElement = this.container.querySelector('.card__price');
        if (priceElement) {
            if (value === null) {
                priceElement.textContent = 'Бесценно';
                if (this.buttonElement) {
                    this.buttonElement.textContent = 'Недоступно';
                    this.buttonElement.disabled = true;
                }
            } else {
                priceElement.textContent = `${value} синапсов`;
                if (this.buttonElement) {
                    this.buttonElement.disabled = false;
                }
            }
        }
    }

    render(data?: Partial<IPreviewCard>): HTMLElement {
        super.render(data);
        
        if (data?.price === null && this.buttonElement) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
        }
        
        return this.container;
    }
}

export interface IBasketCard {
    id: string;
    title: string;
    price: number;
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected index: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this.index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', {target: this.container});
        });
    }

    set cardIndex(value: number) {
        this.index.textContent = String(value);
    }
    
    render(data?: Partial<IBasketCard>): HTMLElement {
        if (data) {
            if (data.id) this.id = data.id;
            if (data.title) this.title = data.title;
            if (data.price) this.price = data.price;
            if (data.index !== undefined) this.cardIndex = data.index;
        }
        return this.container;
    }
}