import { ICustomer } from "../../types";

export class Customer implements ICustomer{
    payments: "" | "cash" | "card";
    address: string;
    email: string;
    phone: string;

    constructor(info: ICustomer) {
        this.payments = info.payments;
        this.address = info.address;
        this.email = info.email;
        this.phone = info.phone
    }

    setCustomerInfo(info: ICustomer): void {
        if (info.payments !== undefined) this.payments = info.payments;
        if (info.address !== undefined) this.address = info.address;
        if (info.email !== undefined) this.email = info.email;
        if (info.phone !== undefined) this.phone = info.phone;
    };
    getCustomerInfo(): ICustomer {
        return {
            payments: this.payments,
            address: this.address,
            email: this.email,
            phone: this.phone
        }
    };
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

    checkValidityForms(): {
        payments?: string,
        address?: string,
        email?: string,
        phone?:string
    } { 
        const errors = {
            payments: this.validateField('payments'),
            address: this.validateField('address'),
            email: this.validateField('email'),
            phone: this.validateField('phone')
        };

        return errors;
    }; 
    clearCustomerInfo(): void {
        this.payments = '';
        this.address = '';
        this.email = '';
        this. phone = '';
    };
}