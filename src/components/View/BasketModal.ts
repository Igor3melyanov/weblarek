import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export class BasketModal extends Component<IBasket> {
    protected list: HTMLElement;
    protected totalCount: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalCount = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        this.list.replaceChildren(...items);
    }
    
    set total(value: number) {
        this.totalCount.textContent = `${value} синапсов`;
    }

    set valid(value: boolean) {
        this.button.disabled = !value;
    }
}