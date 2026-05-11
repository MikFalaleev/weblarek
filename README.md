# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.
View - слой представления, отвечает за отображение данных на странице.
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

Базовые классы
Api — HTTP-клиент. Методы get(uri) и post(uri, data, method) выполняют запросы к серверу, handleResponse обрабатывает ответ.
EventEmitter — брокер событий. Методы on, off, emit, onAll, offAll, trigger.
Component<T> — абстрактный базовый класс компонентов. Принимает container: HTMLElement. Метод render(data?) применяет данные и возвращает корневой элемент.

Типы данных
TPayment — способ оплаты в интерфейсе: "card" | "cash".
IProduct — товар: id, title, description, image, category, price: number | null.
IBuyer — данные покупателя: payment, email, phone, address.
TBuyerErrors — объект ошибок валидации: ключи совпадают с полями IBuyer, значения — тексты ошибок. Отсутствие ключа означает, что поле валидно.
TServerPayment — способ оплаты в формате сервера: "online" | "cash". Значение "card" из приложения соответствует "online" на сервере.
IProductListResponse — ответ GET /product/: { total: number, items: IProduct[] }.
IOrderRequest — тело POST /order: payment: TServerPayment, email, phone, address, total, items: string[].
IOrderResponse — ответ POST /order: { id: string, total: number }.

Модели данных
ProductCatalog(events) — хранит массив товаров и товар для превью.

setItems(items) / getItems() — сохранить/получить каталог. Генерирует catalog:changed.
getItem(id) — найти товар по id.
setPreview(item) / getPreview() — товар для подробного просмотра. Генерирует preview:changed.

Basket(events) — хранит выбранные товары.

addItem(item) / removeItem(item) / clear() — управление корзиной. Генерирует basket:changed.
getItems() / getCount() / getTotalPrice() — получить содержимое, количество и сумму.
hasItem(id) — проверить наличие товара в корзине.

BuyerData(events) — хранит данные покупателя.

setField(field, value) — сохранить одно поле, не затрагивая остальные. Генерирует buyer:changed.
getData() — получить все данные покупателя.
clear() — сбросить все поля.
validate() — вернуть объект ошибок по незаполненным полям.

Слой коммуникации
WebLarekApi(api) — принимает объект IApi, делегирует ему HTTP-запросы.

getProducts() — GET /product/, возвращает IProduct[].
createOrder(order) — POST /order, отправляет данные заказа, возвращает IOrderResponse. Внутри конвертирует payment: "card" → "online" перед отправкой.
