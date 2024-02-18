import { Component } from '../base/Component';
import { IModal } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (evt) => evt.stopPropagation());

		document.addEventListener('keydown', this.handleEscapeClose.bind(this));
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}
	
	handleEscapeClose(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
