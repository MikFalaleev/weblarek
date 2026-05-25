import { Form, IFormState } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types/index';

export interface IOrderFormData extends IFormState {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.cardButton = container.querySelector('[name=card]')!;
    this.cashButton = container.querySelector('[name=cash]')!;
    this.addressInput = container.querySelector('[name=address]')!;

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:change', { field: 'payment', value: 'cash' });
    });
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
