import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccessMessage {
    total: number;
}

export class SuccessMessage extends Component<ISuccessMessage> {
    protected totalPrice: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container)

        this.totalPrice = ensureElement<HTMLElement>('.order-success__description', container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    };

    set total(value: number) {
        this.totalPrice.textContent = `Списано ${value} синапсов`;
    };
}