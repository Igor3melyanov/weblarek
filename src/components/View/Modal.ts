import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeModal: HTMLButtonElement;
    protected modalContent: HTMLElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.closeModal = ensureElement<HTMLButtonElement>(`.modal__close`, this.container);
        this.modalContent = ensureElement(`.modal__content`, this.container);

        this.closeModal.addEventListener(`click`, () => {
            this.events.emit(`modal:close`)
        });
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement) {
        this.modalContent.replaceChildren(value);
    }

    isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }

    render(data?: Partial<IModal>): HTMLElement {
        super.render(data);
        return this.container;
    }
}