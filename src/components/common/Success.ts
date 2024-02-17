import { Component } from '../base/Component';
import { ISuccess, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this.setupCloseAction(actions?.onClick);
	}

	private setupCloseAction(onClick: (() => void) | undefined) {
		if (onClick) {
			this._close.addEventListener('click', onClick);
		}
	}

	set total(value: string) {
		this.setText(this._total, `Списано ${value} синапосов`);
	}
}
