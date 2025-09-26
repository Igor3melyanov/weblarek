import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Form<T> extends Component<T> {
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement('.form__errors', this.container);
        this.errorsElement.style.display = 'none';
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
    
    set errors(value: string[]) {
        const filteredErrors = value.filter(error => error !== '');
        this.errorsElement.textContent = filteredErrors.join(', ');
        this.errorsElement.style.display = filteredErrors.length > 0 ? 'block' : 'none';
    }

    clearForm(): void {
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        this.errors = [];
    }
}

export interface IDeliveryForm {
    payment: 'card' | 'cash';
    address: string;
}

export class DeliveryForm extends Form<IDeliveryForm> {
    protected addressInput: HTMLInputElement;
    protected paymentButtons: HTMLButtonElement[];

    constructor(protected events: IEvents, container: HTMLElement) {
        super(events, container);
        this.addressInput = ensureElement<HTMLInputElement>(`input[name="address"]`, this.container)
        this.paymentButtons = [
            ensureElement<HTMLButtonElement>('button[name="card"]', this.container),
            ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)
        ];

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.events.emit('order:change', {
                    field: 'payment',
                    value: button.name as 'card' | 'cash'
                });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:change', {
                field: 'address', 
                value: this.addressInput.value
            });
        });
        
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('delivery:submit');
        });
    };

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: 'card' | 'cash') {
        const button = this.paymentButtons.find(btn => btn.name === value);
        if (button) {
            this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
            button.classList.add('button_alt-active');
        }
    }
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.emailInput.addEventListener('input', () => {
            this.events.emit('order:change', {
                field: 'email',
                value: this.emailInput.value
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('order:change', {
                field: 'phone',
                value: this.phoneInput.value
            });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}