import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("catalog:changed", { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.preview = item;
    this.events.emit("preview:changed", { item: this.preview });
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
