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
        this.payments = info.payments;
        this.address = info.address;
        this.email = info.email;
        this.phone = info.phone;
    };
    getCustomerInfo(): ICustomer {
        return {
            payments: this.payments,
            address: this.address,
            email: this.email,
            phone: this.phone
        }
    };
    checkValidityForms(): boolean {
        if (!this.payments) return false;
        if (!this.address.trim()) return false;
        if (!this.email.trim()) return false;
        if (!this.phone.trim()) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            return false;
        };
        const phoneDigits = this.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            return false;
        };
        return true;
    };
    clearCustomerInfo(): void {
        this.payments = '';
        this.address = '';
        this.email = '';
        this. phone = '';
    };
}