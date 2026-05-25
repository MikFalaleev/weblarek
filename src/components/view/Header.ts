import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.basketButton = container.querySelector('.header__basket')!;
    this.counterElement = container.querySelector('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
