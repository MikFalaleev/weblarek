import "./scss/styles.scss";

import { ProductCatalog } from "./components/models/ProductCatalog";
import { Basket } from "./components/models/Basket";
import { BuyerData } from "./components/models/BuyerData";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/communication/WebLarekApi";
import { API_URL } from "./utils/constants";

// ProductCatalog
console.group("=== ProductCatalog ===");

const catalog = new ProductCatalog();

catalog.setItems(apiProducts.items);
console.log("getItems():", catalog.getItems());

const firstItem = catalog.getItems()[0];
catalog.setPreview(firstItem);
console.log("getPreview():", catalog.getPreview());

console.log(
  "getItem() по id:",
  catalog.getItem(firstItem.id)?.title === firstItem.title
    ? "Успешно"
    : "Ошибка"
);
console.log("getItem() несуществующий:", catalog.getItem("nonexistent-id"));

console.groupEnd();

// Basket
console.group("=== Basket ===");

const basket = new Basket();
const [itemA, itemB] = catalog.getItems();

basket.addItem(itemA);
basket.addItem(itemB);
basket.addItem(catalog.getItems()[2]);

console.log("getItems() после 3 добавлений:", basket.getItems());
console.log("getCount():", basket.getCount());
console.log("getTotalPrice():", basket.getTotalPrice());
console.log(`hasItem('${itemA.id}'):`, basket.hasItem(itemA.id));
console.log("hasItem(несуществующий):", basket.hasItem("nonexistent-id"));

basket.removeItem(itemB);
console.log("getItems() после удаления itemB:", basket.getItems());

basket.clear();
console.log("getItems() после clear():", basket.getItems());
console.log("getCount() после clear():", basket.getCount());

console.groupEnd();

// ─── BuyerData ────────────────────────────────────────────────────────────────
console.group("=== BuyerData ===");

const buyer = new BuyerData();

console.log("validate() при пустых полях:", buyer.validate());

buyer.setField("payment", "card");
buyer.setField("address", "ул. Пушкина, д. 10");
console.log("validate() после частичного заполнения:", buyer.validate());

buyer.setField("phone", "+79991234567");
buyer.setField("email", "test@example.com");

const finalErrors = buyer.validate();
console.log(
  "validate() при всех заполненных полях:",
  Object.keys(finalErrors).length === 0 ? "Нет ошибок" : finalErrors
);

console.log("getData():", buyer.getData());

buyer.clear();
console.log("getData() после clear():", buyer.getData());

console.groupEnd();

// ─── WebLarekApi ─────────────────────────────────────────────────────────────
console.group("=== WebLarekApi: загрузка каталога ===");

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi
  .getProducts()
  .then((items) => {
    catalog.setItems(items);
    console.log("Каталог с сервера. getItems():", catalog.getItems());
  })
  .catch((err) => {
    console.error("Ошибка загрузки:", err);
  });

console.groupEnd();
