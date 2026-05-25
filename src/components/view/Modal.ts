import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.closeButton = container.querySelector('.modal__close')!;
    this.contentElement = container.querySelector('.modal__content')!;

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
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
