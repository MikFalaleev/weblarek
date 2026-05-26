import { Card, TCardData } from './Card';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';

export type TCardPreviewData = TCardData &
  Pick<IProduct, 'category' | 'image' | 'description'> & {
    buttonText: string;
    buttonDisabled: boolean;
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

  set buttonText(value: string) {
    this.button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }
}
