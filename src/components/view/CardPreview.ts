import { Card, TCardData } from './Card';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';

export type TCardPreviewData = TCardData &
  Pick<IProduct, 'category' | 'image' | 'description'> & {
    inBasket: boolean;
  };

export class CardPreview extends Card<TCardPreviewData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.categoryElement = container.querySelector('.card__category')!;
    this.imageElement = container.querySelector('.card__image')!;
    this.descriptionElement = container.querySelector('.card__text')!;
    this.button = container.querySelector('.card__button')!;
    this.button.addEventListener('click', onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this.categoryElement.classList.add(modifier);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent ?? '');
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
    this.button.disabled = value === null;
    if (value === null) this.button.textContent = 'Недоступно';
  }

  set inBasket(value: boolean) {
    this.button.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }
}
