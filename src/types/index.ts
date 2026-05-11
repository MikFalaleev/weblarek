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
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Серверные типы

/** Ответ сервера на GET /product/ */
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

/** Способ оплаты в формате сервера */
export type TServerPayment = "online" | "cash";

/** Тело запроса POST /order — отличается от IBuyer полем payment: здесь используется TServerPayment */
export interface IOrderRequest {
  payment: TServerPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив id выбранных товаров
}

/** Ответ сервера на POST /order — подтверждение покупки */
export interface IOrderResponse {
  id: string; // идентификатор созданного заказа
  total: number; // сумма, списанная с покупателя
}
