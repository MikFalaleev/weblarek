import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.descriptionElement = container.querySelector(
      '.order-success__description'
    )!;
    this.closeButton = container.querySelector('.order-success__close')!;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
