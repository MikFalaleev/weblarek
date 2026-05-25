import { Component } from '../base/Component';
import { IProduct } from '../../types/index';

export type TCardData = Pick<IProduct, 'id' | 'title' | 'price'>;

// Card — обобщённый базовый класс, T должен включать TCardData
export class Card<T extends TCardData> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector('.card__title')!;
    this.priceElement = container.querySelector('.card__price')!;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }
}
