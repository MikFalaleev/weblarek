import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
  orderButtonDisabled: boolean;
}

export class BasketView extends Component<IBasketViewData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.listElement = container.querySelector('.basket__list')!;
    this.totalElement = container.querySelector('.basket__price')!;
    this.orderButton = container.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set orderButtonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
