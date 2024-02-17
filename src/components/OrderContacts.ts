import { Form } from './common/Form';
import { IEvents } from './base/events';
import { IOrderContacts } from '../types';

export class OrderContacts extends Form<IOrderContacts> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.container.addEventListener('submit', (event: Event) => this.handleSubmit(event));
    }

    private handleSubmit(event: Event) {
        event.preventDefault();
        if (this.validateForm()) {
            this.events.emit('order:submitContacts');
        }
    }

    private validateForm() {
        let isValid = true;
        const formData = new FormData(this.container);
        for (const [field, value] of formData.entries()) {
            if (!value) {
                isValid = false;
                this.events.emit('order:formContactsValid', { field, value: '' });
            }
        }
        return isValid;
    }

    protected onInputChange(field: keyof IOrderContacts, value: string) {
        this.events.emit('order:formContactsValid', { field, value });
    }
}
