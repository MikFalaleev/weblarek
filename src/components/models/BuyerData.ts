import { IBuyer, TPayment, TBuyerErrors } from "../../types/index";

export class BuyerData {
  private _payment: TPayment | null = null;
  private _address: string = "";
  private _phone: string = "";
  private _email: string = "";

  setField(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this._payment = value as TPayment;
    } else {
      (this as Record<string, unknown>)[`_${field}`] = value;
    }
  }

  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = "";
    this._phone = "";
    this._email = "";
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this._payment) errors.payment = "Не выбран вид оплаты";
    if (!this._address.trim()) errors.address = "Укажите адрес доставки";
    if (!this._phone.trim()) errors.phone = "Укажите номер телефона";
    if (!this._email.trim()) errors.email = "Укажите email";

    return errors;
  }
}
