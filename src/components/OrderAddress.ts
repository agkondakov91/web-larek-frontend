import { Form } from './common/Form';
import { IEvents } from './base/events';
import { IOrderAddress } from '../types';

export class OrderAddress extends Form<IOrderAddress> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.container.addEventListener('click', (event: Event) =>
			this.handleButtonClick(event)
		);

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('order:submitAddress');
		});
	}

	private getElements() {
		return {
			card: this.container.querySelector('.online') as HTMLElement,
			cash: this.container.querySelector('.offline') as HTMLElement,
		};
	}

	private handleButtonClick(event: Event) {
		const target = event.target as HTMLElement;
		if (
			target.classList.contains('online') ||
			target.parentElement?.classList.contains('online')
		) {
			this.toggleActive(
				this.getElements().card,
				this.getElements().cash,
				'card'
			);
		} else if (
			target.classList.contains('offline') ||
			target.parentElement?.classList.contains('offline')
		) {
			this.toggleActive(
				this.getElements().cash,
				this.getElements().card,
				'cash'
			);
		}
	}

	private toggleActive(
		activeElement: HTMLElement,
		inactiveElement: HTMLElement,
		paymentType: string
	) {
		activeElement.classList.add('button_alt-active');
		inactiveElement.classList.remove('button_alt-active');
		this.onInputChange('payment', paymentType);
	}

	protected onInputChange(field: keyof IOrderAddress, value: string) {
		this.events.emit('order:formAddressValid', { field, value });
	}
}
