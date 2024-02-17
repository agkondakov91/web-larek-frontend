import { EventEmitter } from '../base/events';
import { Component } from '../base/Component';
import { IBasket } from '../../types';
import { chekNumFormat } from '../../utils/utils';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = container.querySelector<HTMLElement>('.basket__list')!;
		this._total = container.querySelector<HTMLElement>('.basket__price')!;
		this._button = container.querySelector<HTMLElement>('.basket__button')!;
		this._button.addEventListener('click', this.handleOrderClick.bind(this));

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		this._list.textContent = '';
		if (items.length) {
			items.forEach((item) => this._list.appendChild(item));
		} else {
			this._list.textContent = 'В корзине пусто';
		}
	}

	set selected(items: string[]) {
		this.setDisabled(this._button, items.length === 0);
	}

	set total(total: number) {
		this.setText(this._total, `${chekNumFormat(total)} синапсов`);
	}

	private handleOrderClick() {
		this.events.emit('order:openAddress');
	}
}
