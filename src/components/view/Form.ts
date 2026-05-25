import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
  valid: boolean;
  errors: string;
}

export class Form<T extends IFormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this.submitButton = container.querySelector('[type=submit]')!;
    this.errorsElement = container.querySelector('.form__errors')!;

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.events.emit(`${container.name}:change`, {
        field: target.name,
        value: target.value,
      });
    });

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
