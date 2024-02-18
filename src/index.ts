import './scss/styles.scss';
import { InteractionApi } from './components/base/InteractionApi';
import { API_URL, CDN_URL } from './utils/constants';
import { DataState, CatalogChangeEvent, IItem } from './components/DataState';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { CardPreview, CardBasket } from './components/Card';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { OrderContacts } from './components/OrderContacts';
import { OrderAddress } from './components/OrderAddress';
import { IOrderContacts, IOrderAddress } from './types';
import { Success } from './components/common/Success';

const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const basketElem = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketElem = ensureElement<HTMLTemplateElement>('#card-basket');
const orderAddressElem = ensureElement<HTMLTemplateElement>('#order');
const orderContactsElem = ensureElement<HTMLTemplateElement>('#contacts');
const successElem = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const interactionApi = new InteractionApi(CDN_URL, API_URL);
const appData = new DataState({}, events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketElem), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const orderAddressForm = new OrderAddress(
	cloneTemplate(orderAddressElem),
	events
);
const orderContactsForm = new OrderContacts(
	cloneTemplate(orderContactsElem),
	events
);

//Отрисовать карточки
events.on<CatalogChangeEvent>('cards:initialization', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CardPreview('card', cloneTemplate(cardCatalog), {
			onClick: () => events.emit('card:open', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price !== null ? item.price + ' синапсов' : 'Бесценно',
		});
	});
});

//Открыть карточку
events.on('card:open', (item: IItem) => {
	appData.setPreview(item);
});

events.on('card:preview', (item: IItem) => {
	const showItem = (item: IItem) => {
		const card = new CardPreview('card', cloneTemplate(cardPreview), {
			onClick: () => {
				if (!item.status) {
					events.emit('card:addToBasket', item);
				} else {
					events.emit('card:deletFromBasket', item);
				}
				events.emit('card:preview', item);
			},
		});
		modal.render({
			content: card.render({
				category: item.category,
				title: item.title,
				image: item.image,
				price: item.price !== null ? item.price + ' синапсов' : 'Бесценно',
				description: item.description,
				button: item.status,
			}),
		});
	};

	if (item) {
		interactionApi
			.getItemProduct(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

//Заблокировать страницу
events.on('modal:open', () => {
	page.locked = true;
});

//Разблокировать страницу
events.on('modal:close', () => {
	page.locked = false;
});

//Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLDivElement>('div', {}, [
			basket.render({
				selected: appData.order.items,
			}),
		]),
	});
});

//Добавить карточку в корзину
events.on('card:addToBasket', (item: IItem) => {
	item.status = true;
	appData.addItemToOrder(item.id);
	events.emit('basket:render');
});

//Удалить карточку из корзины
events.on('card:deletFromBasket', (item: IItem) => {
	item.status = false;
	appData.deletItemFromOrder(item.id);
	events.emit('basket:render');
});

//Отрисовать добавленные карточки в корзине
events.on('basket:render', () => {
	page.counter = appData.getActiveItems().length;
	basket.items = appData.getActiveItems().map((item, index) => {
		const card = new CardBasket('card', cloneTemplate(cardBasketElem), {
			onClick: () => {
				events.emit('card:deletFromBasket', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price !== null ? item.price + ' синапсов' : 'Бесценно',
			index: index + 1,
		});
	});
	basket.selected = appData.order.items;
	basket.total = appData.getTotal();
});

//Открыть форму способа оплаты
events.on('order:openAddress', () => {
	modal.render({
		content: orderAddressForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//Заполнить данные в форме способа оплаты
events.on(
	'order:formAddressValid',
	(data: { field: keyof IOrderAddress; value: string }) => {
		appData.setOrderField(data.field, data.value);
		orderAddressForm.valid = appData.validateOrderAddress();
	}
);

//Валидация формы способа оплаты
events.on('orderAddress:change', (errors: Partial<IOrderAddress>) => {
	const { payment, address } = errors;
	orderAddressForm.valid = !payment && !address;
	orderAddressForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//Перейти к форме заполнения контактных данных
events.on('order:submitAddress', () => {
	events.emit('order:openContacts');
});

//Открыть форму заполнения контактных данных
events.on('order:openContacts', () => {
	modal.render({
		content: orderContactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

//Заполнить данные в форме контактных данных
events.on(
	'order:formContactsValid',
	(data: { field: keyof IOrderContacts; value: string }) => {
		appData.setOrderField(data.field, data.value);
		orderContactsForm.valid = appData.validateOrderContacts();
	}
);

//Валидация формы контактных данных
events.on('orderContacts:change', (errors: Partial<IOrderContacts>) => {
	const { email, phone } = errors;
	orderContactsForm.valid = !email && !phone;
	orderContactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//Перерисовать содержимое корзины
events.on('basket:change', () => {
	appData.getActiveItems().map((item) => {
		item.status = false;
		basket.items = appData.getActiveItems().map(() => {
			const card = new CardBasket('card', cloneTemplate(cardBasketElem));
			return card.render({
				title: '',
				price: null,
				index: 0,
			});
		});
	});
	page.counter = appData.getActiveItems().length;
	basket.total = appData.getTotal();
});

//Открыть экран успеха
events.on('order:submitContacts', () => {
    appData.order.total = appData.getTotal();
    interactionApi
        .order(appData.order)
        .then((res) => {
            appData.clearBasket();
            const success = new Success(cloneTemplate(successElem), {
                onClick: () => {
                    modal.close();
                },
            });

            modal.render({
                content: success.render({
                    total: appData.order.total.toString(),
                }),
            });

            events.emit('basket:change');
        })
        .catch((err) => {
            console.error(err);
        });
});

//Запрос к серверу
interactionApi
	.getListProducts()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => console.error(err));
