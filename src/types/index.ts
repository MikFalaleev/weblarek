export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// ─── Серверные типы ───────────────────────────────────────────────────────────

/** Ответ сервера на GET /product/ */
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

/**
 * Способ оплаты в формате сервера.
 * Сервер принимает "online" (не "card") для онлайн-оплаты.
 */
export type TServerPayment = "online" | "cash";

/**
 * Тело запроса POST /order.
 * Переиспользует поля IBuyer через Omit, переопределяя только payment
 * на серверный формат TServerPayment.
 */
export interface IOrderRequest extends Omit<IBuyer, "payment"> {
  payment: TServerPayment;
  total: number;
  items: string[];
}

/** Ответ сервера на POST /order — подтверждение покупки */
export interface IOrderResponse {
  id: string;
  total: number;
}
