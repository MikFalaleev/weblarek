import {
  IApi,
  IProduct,
  IProductListResponse,
  IOrderRequest,
  IOrderResponse,
  TPayment,
  TServerPayment,
} from "../../types/index";

/** Маппинг способов оплаты: значения UI → значения сервера */
const paymentMap: Record<TPayment, TServerPayment> = {
  card: "online",
  cash: "cash",
};

export class WebLarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  /**
   * Получает список товаров с сервера.
   * GET /product/
   * Возвращает массив товаров из поля items ответа.
   */
  getProducts(): Promise<IProduct[]> {
    return this._api
      .get<IProductListResponse>("/product/")
      .then((response) => response.items);
  }

  /**
   * Отправляет данные заказа на сервер.
   * POST /order
   * Принимает IOrderRequest, конвертирует payment в серверный формат,
   * возвращает подтверждение IOrderResponse.
   */
  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const serverOrder: IOrderRequest = {
      ...order,
      payment: paymentMap[order.payment as TPayment] ?? order.payment,
    };
    return this._api.post<IOrderResponse>("/order", serverOrder);
  }
}
