//Интерфейс данных с сервера
export interface IProduct {
	id: string;
    description: string;
    image: string;
	title: string; 
    category: string;
    price: number | null;
}

//Интерфейс методов для класса InteractionApi
export interface IInteractionApi {
	getItemProduct: (id: string) => Promise<IProduct>;
	getListProducts: () => Promise<IProduct[]>;
	order: (order: IOrder) => Promise<IOrderResult>;
}

//Интерфейсы для класса DataState
export interface IDataState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

//Интерфейс класса Page
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

//Интерфейс класса Card
export interface ICard<T> {
	title: string;
	description?: string | string[];
	image?: string;
	category?: string;
	price: string;
	button?: boolean;
	status?: T;
	index?: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

//Интерфейс класса CardPreview
export interface ICardPreview<T> {
    description: string | string[];
    image: string;
    category: string;
}

//Интерфейс класса CardBasket
export interface ICardBasket<T> {
	index: number;
}

//Интерфейс класса Modal
export interface IModal {
	content: HTMLElement;
}

//Интерфейс класса Basket
export interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

//Интерфейсы класса Form
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IForm {
	valid: boolean;
	errors: string[];
}

//Интерфейс формы с контактами, класс OrderContacts
export interface IOrderContacts {
	email: string;
	phone: string;
}

//Интерфейс формы с адресом, класс OrderAddress
export interface IOrderAddress extends IOrderContacts {
	payment: string;
    address: string;
}

//Интерфейс информации о заказе
export interface IOrder extends IOrderAddress {
	total: number;
	items: string[];
}

//Интерфейс информации об итоговом заказе
export interface IOrderResult {
	id: string;
	total: number;
}

//Интерфейсы класса Success
export interface ISuccess {
    total: string;
}

export interface ISuccessActions {
    onClick: () => void;
}