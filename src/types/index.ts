//Интерфейс данных с сервера
export interface IProduct {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICartItem {
    product: IProduct;
    amount: number;
}

export interface IOrder {
    orderId: string;
    products: ICartItem[];
    paymentMethod: string;
    deliveryAddress: string;
    contactInfo: {
        email: string;
        phone: string;
    }
}

//Интерфейсы для API
export interface IOrderResult {
    id: string;
}

export interface InteractionApi {
    getItemProduct: (id: string) => Promise<IProduct>;
    getListProducts: () => Promise<IProduct[]>;
    order: (order: IOrder) => Promise<IOrderResult>;
}

//Интерфейс класса Page
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

//Интерфейс класса Basket
export interface IBasket {
    items: HTMLElement[];
    total: number;
    button: string[];
}

//Интерфейс класса Modal
export interface IModal {
    content: HTMLElement;
}

//Интерфейс класса Form
export interface IForm {
    valid: boolean;
    errors: string[];
}

//Интерфейс класса OrderAddress
export interface IOrderAddress {
    payment: string;
    address: string;
}

//Интерфейс класса OrderContacts
export interface IOrderContacts {
    email: string;
    phone: string;
}

//Интерфейсы класса Success
export interface ISuccess {
    total: string;
}

export interface ISuccessActions {
    onClick: () => void;
}

//Интерфейс класса Card
export interface ICard<T> {
    title: string;             
    description?: string | string[];
    image?: string;
    category?: string;
    price?: string;
    button?: boolean;
		index?: number;
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

//Интерфейс класса EventEmitter
type EventName = string | RegExp;
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
}