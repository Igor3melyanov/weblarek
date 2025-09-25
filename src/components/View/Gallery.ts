import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected items: HTMLElement[];
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.items = [];
    };

    set catalog(elements: HTMLElement[]) {
        this.container.replaceChildren(...elements); // Исправлено
        this.items = elements;
    }
}