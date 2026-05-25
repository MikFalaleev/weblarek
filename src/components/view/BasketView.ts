import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketViewData {
  items: HTMLElement[];
  total: number;
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
    if (value.length === 0) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this.orderButton.disabled = true;
    } else {
      this.listElement.replaceChildren(...value);
      this.orderButton.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
