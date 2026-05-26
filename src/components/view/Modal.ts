import { Component } from '../base/Component';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected pageWrapper: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = container.querySelector('.modal__close')!;
    this.contentElement = container.querySelector('.modal__content')!;
    this.pageWrapper = document.querySelector('.page__wrapper');

    this.closeButton.addEventListener('click', () => this.close());
    container.addEventListener('click', (e) => {
      if (e.target === container) this.close();
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.pageWrapper?.classList.add('page__wrapper_locked');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
    this.pageWrapper?.classList.remove('page__wrapper_locked');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
