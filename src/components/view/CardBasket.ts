import { Card, TCardData } from './Card';

export type TCardBasketData = TCardData & { index: number };

export class CardBasket extends Card<TCardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index')!;
    this.deleteButton = container.querySelector('.basket__item-delete')!;
    this.deleteButton.addEventListener('click', onDelete);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
