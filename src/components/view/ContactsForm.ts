import { Form, IFormState } from './Form';
import { IEvents } from '../base/Events';

export interface IContactsFormData extends IFormState {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.emailInput = container.querySelector('[name=email]')!;
    this.phoneInput = container.querySelector('[name=phone]')!;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
