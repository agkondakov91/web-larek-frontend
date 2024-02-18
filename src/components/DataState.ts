import { Model } from './base/Model';
import {
	FormErrors,
	IDataState,
	IProduct,
	IOrder,
	IOrderAddress,
} from '../types';

export type CatalogChangeEvent = {
	catalog: IItem[];
};

export interface IItem {
	about?: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
	status?: boolean;
	category: string;
}

export class DataState extends Model<IDataState> {
	basket: IItem[];
	catalog: IItem[];
	order: IOrder = {
		address: '',
		payment: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('cards:initialization', { catalog: this.catalog });
	}

	setPreview(item: IItem) {
		this.preview = item.id;
		this.emitChanges('card:preview', item);
	}

	addItemToOrder(id: string) {
		this.order.items.push(id);
	}

	deletItemFromOrder(id: string) {
		const items = this.order.items.indexOf(id);
		if (items !== -1) {
			this.order.items.splice(items, 1);
		}
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	getActiveItems(): IItem[] {
		return this.catalog.filter((item) => item.status === true);
	}

	setOrderField(field: keyof IOrderAddress, value: string) {
		this.order[field] = value;
	}

	validateOrderAddress() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Заполните адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderAddress:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrderContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите верный email';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		}
		this.formErrors = errors;
		this.events.emit('orderContacts:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.order.total = 0;
		this.order.items.forEach((id) => {
			const item = this.catalog.find((it) => it.id === id);
			if (item) {
				this.order.total += item.price;
			}
		});
	
		this.order.items = [];
	}
}
