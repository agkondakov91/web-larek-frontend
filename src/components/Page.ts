import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.initializeElements();
		if (this._basket) {
			this._basket.addEventListener('click', this.handleBasketClick);
		}
	}

	private initializeElements() {
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');
	}

	private handleBasketClick = () => {
		this.events.emit('basket:open');
	};

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		if (this._catalog) {
			this._catalog.replaceChildren(...items);
		}
	}

	set locked(value: boolean) {
		if (this._wrapper) {
			if (value) {
				this._wrapper.classList.add('page__wrapper_locked');
			} else {
				this._wrapper.classList.remove('page__wrapper_locked');
			}
		}
	}
}
