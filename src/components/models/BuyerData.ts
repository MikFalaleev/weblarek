import { IBuyer, TPayment, TBuyerErrors } from "../../types/index";

export class BuyerData {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  setField(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this.payment = value as TPayment;
    } else if (field === "address") {
      this.address = value;
    } else if (field === "phone") {
      this.phone = value;
    } else if (field === "email") {
      this.email = value;
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.address.trim()) errors.address = "Укажите адрес доставки";
    if (!this.phone.trim()) errors.phone = "Укажите номер телефона";
    if (!this.email.trim()) errors.email = "Укажите email";

    return errors;
  }
}
