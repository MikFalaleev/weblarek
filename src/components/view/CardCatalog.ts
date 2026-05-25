import { Card, TCardData } from './Card';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';

export type TCardCatalogData = TCardData &
  Pick<IProduct, 'category' | 'image'>;

export class CardCatalog extends Card<TCardCatalogData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.categoryElement = container.querySelector('.card__category')!;
    this.imageElement = container.querySelector('.card__image')!;
    container.addEventListener('click', onClick);
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
}
