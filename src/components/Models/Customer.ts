import { ICustomer } from "../../types";
import { EventEmitter } from "../base/Events";

export class Customer implements ICustomer{
    payments: "" | "cash" | "card";
    address: string;
    email: string;
    phone: string;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.payments = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events = events;
    }

    setPayment(payment: 'cash' | 'card'): void {
        this.payments = payment;
        this.events.emit('customer:changed', { 
            field: 'payments', 
            value: payment 
        });
        this.validateAndEmit();
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('customer:changed', { 
            field: 'address', 
            value: address 
        });
        this.validateAndEmit();
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('customer:changed', { 
            field: 'email', 
            value: email 
        });
        this.validateAndEmit();
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('customer:changed', { 
            field: 'phone', 
            value: phone 
        });
        this.validateAndEmit();
    }

    getCustomerInfo(): ICustomer {
        return {
            payments: this.payments,
            address: this.address,
            email: this.email,
            phone: this.phone
        }
    }

    validateField(field: keyof ICustomer): string {
        const value = this[field];
        
        switch (field) {
            case 'payments':
                return !value ? 'Способ оплаты должен быть выбран' : '';
            case 'address':
                return !value ? 'Поле адреса пустое' : '';
            case 'email':
                return !value ? 'Поле Email пустое' : '';
            case 'phone':
                return !value ? 'Поле телефона пустое' : '';
            default:
                return '';
        }
    }

    checkValidityForms(): Record<string, string> {
        return {
            payments: this.validateField('payments'),
            address: this.validateField('address'),
            email: this.validateField('email'),
            phone: this.validateField('phone')
        };
    }

    private validateAndEmit(): void {
        const errors = this.checkValidityForms();
        this.events.emit('form:errors', { errors });
    }

    clearCustomerInfo(): void {
        this.payments = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('customer:changed', { 
            field: 'all', 
            value: this.getCustomerInfo() 
        });
    }
}