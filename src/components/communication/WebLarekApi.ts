import {
  IApi,
  IProductListResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types/index";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * Получает список товаров с сервера.
   * GET /product/ Возвращает массив товаров и их количество */
  getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product/");
  }

  /** POST /order — отправляет данные заказа, возвращает подтверждение */
  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order", order);
  }
}
