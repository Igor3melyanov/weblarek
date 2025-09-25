import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeaderBasket {
    counter: number;
};

export class HeaderBasket extends Component<IHeaderBasket>{
    protected counterElement: HTMLElement;
    protected openBasketModal: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.counterElement = ensureElement<HTMLElement>(`.header__basket-counter`, this.container);
        this.openBasketModal = ensureElement<HTMLButtonElement>(`.header__basket`, this.container);

        this.openBasketModal.addEventListener(`click`, () => {
            this.events.emit(`basket:open`)
        })
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value)
    }
}