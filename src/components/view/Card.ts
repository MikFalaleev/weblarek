import { Component } from '../base/Component';

export interface TCardData {
  title: string;
  price: string;
}

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

  set price(value: string) {
    this.priceElement.textContent = value;
  }
}
