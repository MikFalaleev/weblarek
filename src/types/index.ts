export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** Способ оплаты — значения совпадают с форматом сервера */
export type TServerPayment = "online" | "cash";

export interface IBuyer {
  payment: TServerPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// ─── Серверные типы ───────────────────────────────────────────────────────────

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  payment: TServerPayment;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}
