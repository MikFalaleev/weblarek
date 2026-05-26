import { Form, IFormState } from './Form';
import { IEvents } from '../base/Events';
import { TServerPayment } from '../../types/index';

export interface IOrderFormData extends IFormState {
  payment: TServerPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.onlineButton = container.querySelector('[name=card]')!;
    this.cashButton = container.querySelector('[name=cash]')!;
    this.addressInput = container.querySelector('[name=address]')!;

    this.onlineButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'online' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'cash' });
    });
  }

  set payment(value: TServerPayment | null) {
    this.onlineButton.classList.toggle('button_alt-active', value === 'online');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
