# Проектная работа "Web-ларёк"

Учебный проект интернет-магазина с товарами для веб-разработчиков — **Web-ларёк.** 
В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ.

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

---

## Архитектура проекта

В проекте используется событийно-ориентированный подход. 
Архитектура приложения описана по шаблону проектирования MVP:

**Model (Модель):**

- Отвечает за бизнес-логику и работу с данными.
- Хранит информацию о товарах, корзине, заказах и других сущностях.

**View (Представление):**

- Отвечает за отображение данных на экране и взаимодействие с пользователем.
- Отвечает за отображение каталога товаров, модальных окон и форм оформления заказа.

**Presenter (Презентер):**

- Связывает модель и представление.
- Отслеживает изменения данных и обновляет представление, а также обрабатывает пользовательские события.

### Используемый стек:

- TypeScript
- HTML, CSS (или SCSS)
- Webpack
- JavaScript (для взаимодействия с DOM)

### Инструкция по сборке и запуску:

Убедитесь, что у вас установлен Node.js и npm. Клонируйте репозиторий с проектом.

Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

Сборка проекта выполняется командой

```bash
npm run build
```

или

```bash
yarn build
```

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Базовые классы

### Класс Api

Данный класс представляет собой обёртку для работы с запросами к API. 
В конструктор класс принимает базовый URL и набор возможных параметров запроса fetch().

```tsx
baseUrl: string;
options: RequestInit;
```

Класс имеет такие методы:

`get` — выполняет GET-запрос к указанному URL;

`post` — выполняет POST-запрос к указанному URL.

### Класс InteractionApi

Данный класс расширяет класс Api для реализации методов взаимодействия с API.

```tsx
interface IOrderResult {
    id: string;
}

interface InteractionApi {
    getItemProduct: (id: string) => Promise<IProduct>;
    getListProducts: () => Promise<IProduct[]>;
    order: (order: IOrder) => Promise<IOrderResult>;
}
```

Класс имеет такие методы:

`getItemProduct` — получает информацию о товаре;

`getListProducts` — получает список товаров;

`order` — оформляет заказ товаров.

## Блок «Модели данных»

**Товары**

Содержит массив данных, предоставляемых сервером по каждому из возможных товаров, 
отображаемых на странице. Типы данных, получаемых в ответ на **get**-запрос к серверу:

```tsx
interface IProduct {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Действия с моделью данных: получение списка товаров с сервера и добавление товара в корзину.

**Корзина**

Содержит массив объектов товаров, которые добавляются в корзину. Она состоит из цифрового счётчика 
количества добавленных элементов, заголовка с названием товара, стоимость отдельного товара 
и итоговой стоимость всего заказа.

```tsx
interface ICartItem {
    product: IProduct;
    amount: number;
}
```

Действия с моделью данных: добавление товара в корзину, удаление товара из корзины, 
получение общей стоимости товаров в корзине.

**Заказ**

Содержит информацию о конкретном заказе, который совершает пользователь. 
Он состоит из информации о товарах, способе оплаты, адреса доставки и контактной информации покупателя.

```tsx
interface IOrder {
    orderId: string;
    products: ICartItem[];
    paymentMethod: string;
    deliveryAddress: string;
    contactInfo: {
        email: string;
        phone: string;
    }
}
```

Действие с моделью данных: оформление заказа, отправка заказа на сервер.

### **Класс DataState**

Данный класс представляет собой центральное хранилище всех данных приложения. 
Класс реализует следующий интерфейс:

```tsx
interface IDataState {
    catalog: IProduct[];
    basket: string[];
    order: IOrder | null;
}
```

Он содержит следующие свойства: 

`catalog` — список товаров в каталоге;

`basket` — список товаров в корзине;

`order` — информация о заказе;

`formErrors` — ошибки формы заказа.

Класс имеет такие методы:

`getTotal` — реализует общую итоговую сумму заказа;

`setCatalog` — устанавливает список товаров в каталоге;

`getActiveItems` — получает список активных товаров в корзине;

`addItemToOrder` — добавляет товар в заказ;

`deletItemFromOrder` — удаляет товар из заказа;

`clearOrder` — очищает корзину;

`validateOrder` — валидирует правильность заполнения контактной информации.

## Блок «Компоненты представления»

### Класс Component

Данный класс обеспечивает основу для создания других компонентов веб-приложения, 
предоставляя удобные методы для работы с DOM и отображения пользовательского интерфейса. 
Класс не может быть инстанциирован напрямую, т.к. является абстрактным. 
Вместо этого он предназначен для наследования. Подклассы могут расширять его функциональность, 
реализуя свои собственные методы и логику.

Класс принимает в конструктор контейнер, в котором будет размещаться компонент:

```tsx
container: HTMLElement;
```

Класс содержит следующие методы:

`setText` — устанавливает текстовое содержимое элемента;

`setDisabled` — изменяет статус блокировки элемента;

`setImage` — устанавливает изображение с альтернативным текстом;

`render` — возвращает контейнер компонента, который может быть добавлен на страницу.

### **Класс Page**

Данный класс представляет страницу приложения и отвечает за управление её состояниями 
и отображением различной информации. Он наследуется от базового класса Component. 
Класс реализует следующий интерфейс:

```tsx
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

В конструктор класс принимает счётчик товаров, каталог товаров, сам контейнер страницы и корзину:

```tsx
counter: HTMLElement;
catalog: HTMLElement;
wrapper: HTMLElement;
basket: HTMLElement;
```

Класс содержит следующие сеттеры:

`counter` — устанавливает значение счётчика товаров в корзине;

`catalog` — отображает каталог товаров на странице;

`locked` — блокирует или разблокирует страницу при открытие/закрытии модального окна.

### Класс Basket

Данный класс представляет собой компонент интерфейса корзины и наследуется от базового класса Component. 
Он позволяет управлять отображением корзины в приложении, обновляя список товаров, 
общую стоимость и состояние кнопки. Класс реализует следующий интерфейс:

```tsx
interface IBasket {
    items: HTMLElement[];
    total: number;
    button: string[];
}
```

В конструкторе класса происходит инициализация внутренних элементов корзины:

```tsx
list: HTMLElement;
total: HTMLElement;
button: HTMLElement;
```

Класс содержит следующие методы:

`items` — устанавливает элементы в корзине;

`button` — управляет состоянием кнопки корзины;

`total` — устанавливает общую стоимость товаров в корзине.

### Класс Modal

Данный класс представляет собой компонент модального окна и наследуется от базового класса Component. 
Он позволяет управлять отображением модального окна в приложении, открывать и закрывать его, 
а также устанавливать содержимое внутри модального окна. Класс реализует следующий интерфейс:

```tsx
interface IModal {
    content: HTMLElement;
}
```

В конструкторе класса происходит инициализация внутренних элементов модального окна:

```tsx
closeButton: HTMLButtonElement;
content: HTMLElement;
```

Класс содержит следующие методы:

`content` — устанавливает содержимое модального окна;

`open` — открывает модальное окно;

`close` — закрывает модальное окно;

`render` — переопределяет метод рендеринга базового класса Component.

### Класс Form

Данный класс представляет компонент формы и наследуется от базового класса Component. 
Он позволяет управлять поведением и отображением формы в приложении, обрабатывать ввод 
данных пользователя и генерировать события при изменении значений полей и отправке формы. 
Класс реализует следующий интерфейс:

```tsx
interface IForm {
    valid: boolean;
    errors: string[];
}
```

В конструкторе класса происходит инициализация внутренних элементов формы:

```tsx
submit: HTMLButtonElement;
errors: HTMLElement;
```

Класс содержит следующие методы:

`onInputChange` — генерирует событие с информацией о измененном поле и его значении;

`valid` — устанавливает состояние кнопки отправки формы;

`errors` — устанавливает текст ошибки формы;

`render` — переопределяет метод рендеринга базового класса Component.

### Класс **OrderAddress**

Данный класс отвечает за ввод адреса доставки и выбор способа оплаты и наследуется 
от обобщенного класса Form. Он представляет форму для ввода адреса доставки и выбора 
метода оплаты, а также обеспечивает обработку введенных данных и отправку информации 
о форме при оформлении заказа. Класс реализует следующий интерфейс:

```tsx
interface IOrderAddress {
    payment: string;
    address: string;
}
```

В конструкторе класса происходит инициализация выбора метода оплаты:

```tsx
paymentOnline?: HTMLElement;
paymentOffline?: HTMLElement;
```

Класс содержит следующий метод:

`onInputChange` — генерирует событие с информацией о измененном поле и его значении.

### Класс OrderContacts

Данный класс отвечает за ввод контактной информации пользователя и наследуется 
от обобщенного класса Form. Он представляет форму для ввода контактной информации в заказе, 
обеспечивая обработку событий и взаимодействие с родительским классом Form. 
Класс реализует следующий интерфейс:

```tsx
interface IOrderContacts {
    email: string;
    phone: string;
}
```

Класс содержит следующий метод:

`onInputChange` — генерирует событие с информацией о измененном поле и его значении.

### Класс Success

Данный класс представляет компонент, отображающий сообщение об успешном завершении заказа 
и наследуется от базового класса Component. Он позволяет отображать сообщение об успешном 
завершении заказа и предоставлять пользователю возможность закрыть это сообщение. 
Класс реализует следующие интерфейсы:

```tsx
interface ISuccess {
    total: string;
}

interface ISuccessActions {
    onClick: () => void;
}
```

В конструкторе класса происходит инициализация внутренних элементов сообщения:

```tsx
close: HTMLElement;
total: HTMLElement;
```

Класс содержит следующий сеттер:

`total` — устанавливает текст сообщения о списании синапсов после успешного завершения заказа.

### Класс Card

Данный класс является основным классом для отображения карточек товаров и наследуется 
от базового класса Component. Он содержит основные элементы карточки (название, цена, кнопка). 
Класс реализует следующий интерфейс:

```tsx
interface ICard<T> {
    title: string;             
    description?: string | string[];
    image?: string;
    category?: string;
    price?: string;
    button?: boolean;
		index?: number;
}
```

В конструкторе класса происходит инициализация основных элементов карточки:

```tsx
title: HTMLElement;
price: HTMLElement;
button: HTMLButtonElement;
```

Класс содержит следующие методы:

`id` — (геттер и сеттер): получает или устанавливает идентификатор товара;

`title` — (геттер и сеттер): получает или устанавливает название товара;

`price` — (геттер и сеттер): получает или устанавливает цену товара;

`button` — (сеттер): устанавливает состояние кнопки.

### Класс Card**Preview**

Данный класс предназначен для предварительного просмотра товара и расширяет класс Card. 
Дополняет базовый класс элементами, такими как изображение товара, категория и описание. 
Класс реализует следующий интерфейс:

```tsx
interface ICardPreview<T> {
    description: string | string[];
    image: string;
    category: string;
}
```

В конструкторе класса происходит инициализация элементов для отображения изображения, 
категории и описания товара:

```tsx
description: HTMLElement;
image: HTMLImageElement;
category: HTMLElement;
```

Класс содержит следующие методы:

`category` — (геттер и сеттер): получает или устанавливает категорию товара и соответствующий 
стиль для отображения категории;

`image` — (сеттер): устанавливает изображение товара;

`description` — (сеттер): устанавливает описание товара.

### Класс CardBasket

Данный класс предназначен для отображения карточек товаров в корзине и расширяет класс Card. 
Дополняет базовый класс элементом индекса, указывающим порядковый номер товара в корзине. 
Класс реализует следующий интерфейс:

```tsx
interface ICardBasket<T> {
    index: number;
}
```

В конструкторе класса происходит инициализация элемента для отображения индекса товара в корзине:

```tsx
index: HTMLElement;
```

Класс содержит следующий метод:

`index` — (сеттер): устанавливает порядковый номер товара в корзине.

## Блок «Управления»

### Класс EventEmitter

Данный класс представляет собой брокер событий, который позволяет регистрировать 
обработчики для определенных событий и инициировать события с передачей данных. 
Он обеспечивает удобный способ управления событиями и их обработчиками в приложении. 
Класс реализует следующий интерфейс:

```tsx
type EventName = string | RegExp;

interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
}
```

В конструкторе создается новый экземпляр класса **`Map`**, который будет использоваться 
для хранения обработчиков событий.

```tsx
events: Map<EventName, Set<Subscriber>>;
```

Класс содержит следующие методы:

`on` — добавляет переданный обработчик в набор обработчиков для указанного события;

`off` — удаляет указанный обработчик из набора обработчиков для события;

`emit` — инициирует событие, вызывая все зарегистрированные обработчики для этого события.

События, реализуемые в данном проекте:

**card:initialization —** Отрисовывает карточки товаров на странице.

**card:open —** Открывает превью выбранного товара.

**card:preview—** Отображает карточку товара в модальном окне.

**card:addToBasket —** Меняет статус карточки товара на "добавлено в корзину" и обновляет содержимое корзины.

**card:deletFromBasket —** Меняет статус карточки товара на "удалено из корзины" и обновляет содержимое корзины.

**modal:open —** Событие срабатывает при открытии модального окна.

**modal:close —** Событие срабатывает при закрытии модального окна.

**order:openAddress —** Событие срабатывает при открытии формы с адресом в модальном окне.

**order:openContacts —** Событие срабатывает при открытии формы с контактами в модальном окне.

**order:changeAddress —** Обновляет данные в модели заказа формы с адресом.

**order:changeContacts —** Обновляет данные в модели заказа формы с контактами.

**order:formAddressValid —** Проверяет наличие ошибок и валидность формы с адресом.

**order:formContactsValid —** Проверяет наличие ошибок и валидность формы с контактами.

**order:submitAddress —** Открывает модальное окно с формой контактов.

**order:submitContacts —** Отправляет заказ на сервер и отображает модальное окно с сообщением об успешном оформлении заказа.

**basket:open —** Событие срабатывает при открытии корзины в модальном окне.

**basket:change —** Событие срабатывает при изменении содержимого корзины.

**basket:render —** Событие срабатывает при необходимости перерисовки содержимого корзины, а также сбрасывает статус всех карточек товаров в корзине.