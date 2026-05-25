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

import { IProduct, IBuyer } from "./types/index";

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

// ─── Компоненты представления ─────────────────────────────────────────────────
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
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

// ─── Вспомогательная функция: рендер карточек корзины ────────────────────────
function renderBasketItems(): HTMLElement[] {
  return basket.getItems().map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), () => {
      basket.removeItem(product);
    });
    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });
}

// ─── Презентер: обработчики событий ──────────────────────────────────────────

// Каталог изменился → перерисовываем галерею карточками
events.on("catalog:changed", () => {
  const cards = catalog.getItems().map((product: IProduct) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), () => {
      catalog.setPreview(product);
    });
    return card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: CDN_URL + product.image,
    });
  });
  gallery.render({ catalog: cards });
});

// Выбран товар для просмотра → открываем превью в модальном окне
events.on("preview:changed", ({ item }: { item: IProduct }) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), () => {
    if (basket.hasItem(item.id)) {
      basket.removeItem(item);
    } else {
      basket.addItem(item);
    }
    modal.close();
  });
  modal.render({
    content: card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      image: CDN_URL + item.image,
      description: item.description,
      inBasket: basket.hasItem(item.id),
    }),
  });
});

// Корзина изменилась → обновляем счётчик в шапке и содержимое корзины
events.on("basket:changed", () => {
  header.render({ counter: basket.getCount() });
  basketView.render({
    items: renderBasketItems(),
    total: basket.getTotalPrice(),
  });
});

// Данные покупателя изменились → валидируем и обновляем состояние форм
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

// Нажата кнопка корзины в шапке → открываем корзину в модальном окне
events.on("basket:open", () => {
  modal.render({
    content: basketView.render({
      items: renderBasketItems(),
      total: basket.getTotalPrice(),
    }),
  });
});

// Нажата кнопка «Оформить» в корзине → открываем форму оплаты и адреса
events.on("basket:order", () => {
  modal.render({
    content: orderForm.render({
      payment: buyer.getData().payment,
      address: buyer.getData().address,
      valid: false,
      errors: "",
    }),
  });
});

// Изменилось поле формы оплаты → сохраняем в модель покупателя
events.on(
  "order:change",
  ({ field, value }: { field: keyof IBuyer; value: string }) => {
    buyer.setField(field, value);
  }
);

// Форма оплаты отправлена → открываем форму контактов
events.on("order:submit", () => {
  modal.render({
    content: contactsForm.render({
      email: buyer.getData().email,
      phone: buyer.getData().phone,
      valid: false,
      errors: "",
    }),
  });
});

// Изменилось поле формы контактов → сохраняем в модель покупателя
events.on(
  "contacts:change",
  ({ field, value }: { field: keyof IBuyer; value: string }) => {
    buyer.setField(field, value);
  }
);

// Форма контактов отправлена → отправляем заказ на сервер
events.on("contacts:submit", () => {
  const data = buyer.getData();
  webLarekApi
    .createOrder({
      payment: data.payment === "card" ? "online" : "cash",
      email: data.email,
      phone: data.phone,
      address: data.address,
      items: basket
        .getItems()
        .filter((item) => item.price !== null)
        .map((item) => item.id),
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

// Экран успеха закрыт → закрываем модальное окно
events.on("success:close", () => {
  modal.close();
});

// Модальное окно открылось → блокируем скролл страницы
events.on("modal:open", () => {
  document
    .querySelector(".page__wrapper")
    ?.classList.add("page__wrapper_locked");
});

// Модальное окно закрылось → разблокируем скролл страницы
events.on("modal:close", () => {
  document
    .querySelector(".page__wrapper")
    ?.classList.remove("page__wrapper_locked");
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
