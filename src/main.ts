import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Basket } from "./components/models/Basket";
import { BuyerData } from "./components/models/BuyerData";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/communication/WebLarekApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { BasketView } from "./components/view/BasketView";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

import { IProduct, IBuyer, TServerPayment } from "./types/index";

// ─── Брокер событий ───────────────────────────────────────────────────────────
const events = new EventEmitter();

// ─── Модели ───────────────────────────────────────────────────────────────────
const catalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new BuyerData(events);

// ─── API ──────────────────────────────────────────────────────────────────────
const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

// ─── Шаблоны ──────────────────────────────────────────────────────────────────
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// ─── Компоненты представления (создаются один раз) ────────────────────────────
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>(orderTemplate),
  events
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>(contactsTemplate),
  events
);
const successView = new Success(cloneTemplate(successTemplate), events);

// cardPreview создаётся один раз, кнопка эмитит событие
const cardPreview = new CardPreview(
  cloneTemplate(cardPreviewTemplate),
  () => events.emit("card:action")
);

// ─── Утилита форматирования цены ──────────────────────────────────────────────
function formatPrice(price: number | null): string {
  return price === null ? "Бесценно" : `${price} синапсов`;
}

// ─── Утилита: рендер карточек корзины ─────────────────────────────────────────
function renderBasketItems(): HTMLElement[] {
  return basket.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), () => {
      events.emit("basket:remove", { product });
    });
    return card.render({
      title: product.title,
      price: formatPrice(product.price),
      index: index + 1,
    });
  });
}

// ─── Presenter: обработчики событий ──────────────────────────────────────────

// Каталог изменился → перерисовываем галерею
events.on("catalog:changed", () => {
  const cards = catalog.getItems().map((product: IProduct) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), () => {
      events.emit("card:select", { product });
    });
    return card.render({
      title: product.title,
      price: formatPrice(product.price),
      category: product.category,
      image: CDN_URL + product.image,
    });
  });
  gallery.render({ catalog: cards });
});

// Пользователь кликнул на карточку → сохраняем превью в модели
events.on("card:select", ({ product }: { product: IProduct }) => {
  catalog.setPreview(product);
});

// Превью изменилось → перерисовываем cardPreview и открываем модалку
events.on("preview:changed", () => {
  const item = catalog.getPreview()!;
  const inBasket = basket.hasItem(item.id);
  modal.render({
    content: cardPreview.render({
      title: item.title,
      price: formatPrice(item.price),
      category: item.category,
      image: CDN_URL + item.image,
      description: item.description,
      buttonText: item.price === null ? "Недоступно" : inBasket ? "Удалить из корзины" : "В корзину",
      buttonDisabled: item.price === null,
    }),
  });
});

// Пользователь нажал кнопку в превью → добавить/удалить из корзины
events.on("card:action", () => {
  const item = catalog.getPreview()!;
  if (basket.hasItem(item.id)) {
    basket.removeItem(item);
  } else {
    basket.addItem(item);
  }
  modal.close();
});

// Корзина изменилась → обновляем счётчик и содержимое корзины
events.on("basket:changed", () => {
  const items = renderBasketItems();
  header.render({ counter: basket.getCount() });
  basketView.render({
    items,
    total: basket.getTotalPrice(),
    orderButtonDisabled: items.length === 0,
  });
});

// Пользователь удалил товар из корзины
events.on("basket:remove", ({ product }: { product: IProduct }) => {
  basket.removeItem(product);
});

// Нажата иконка корзины → открываем модалку с уже отрисованной корзиной
events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
});

// Нажата кнопка «Оформить» → открываем форму оплаты
events.on("basket:order", () => {
  const errors = buyer.validate();
  const data = buyer.getData();
  modal.render({
    content: orderForm.render({
      payment: data.payment,
      address: data.address,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(Boolean).join(", "),
    }),
  });
});

// Изменилось поле формы оплаты → сохраняем в модель
events.on(
  "order:change",
  ({ field, value }: { field: keyof IBuyer; value: string }) => {
    buyer.setField(field, value);
  }
);

// Форма оплаты отправлена → открываем форму контактов
events.on("order:submit", () => {
  const errors = buyer.validate();
  const data = buyer.getData();
  modal.render({
    content: contactsForm.render({
      email: data.email,
      phone: data.phone,
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join(", "),
    }),
  });
});

// Изменилось поле формы контактов → сохраняем в модель
events.on(
  "contacts:change",
  ({ field, value }: { field: keyof IBuyer; value: string }) => {
    buyer.setField(field, value);
  }
);

// Данные покупателя изменились → обновляем валидацию форм
events.on("buyer:changed", () => {
  const errors = buyer.validate();
  const data = buyer.getData();

  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join(", "),
  });

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join(", "),
  });
});

// Форма контактов отправлена → отправляем заказ на сервер
events.on("contacts:submit", () => {
  const data = buyer.getData();
  webLarekApi
    .createOrder({
      ...data,
      payment: data.payment as TServerPayment,
      items: basket.getItems().map((item) => item.id),
      total: basket.getTotalPrice(),
    })
    .then((result) => {
      basket.clear();
      buyer.clear();
      modal.render({
        content: successView.render({ total: result.total }),
      });
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
    });
});

// Экран успеха закрыт → закрываем модалку
events.on("success:close", () => {
  modal.close();
});

// ─── Загрузка каталога с сервера ──────────────────────────────────────────────
webLarekApi
  .getProducts()
  .then((data) => {
    catalog.setItems(data.items);
  })
  .catch((err) => {
    console.error("Ошибка загрузки каталога:", err);
  });
