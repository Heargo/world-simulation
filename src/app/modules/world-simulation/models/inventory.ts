import { Resource } from './resources';

export interface InventoryElement {
  resource: Resource;
  quantity: number;
}

export class Inventory {
  content: InventoryElement[];
  constructor(content: InventoryElement[] = []) {
    this.content = content;
  }

  add(resource: Resource, quantity: number): void {
    const element = this.content.find(el => el.resource === resource);
    if (element) {
      element.quantity += quantity;
    } else {
      this.content.push({ resource, quantity });
    }
  }

  remove(resource: Resource, quantity: number): void {
    const element = this.content.find(el => el.resource === resource);
    if (element) {
      element.quantity -= quantity;
      if (element.quantity <= 0) {
        this.content = this.content.filter(el => el.resource !== resource);
      }
    }
  }

  getTotalSize(): number {
    return this.content.reduce(
      (acc, el) => acc + el.quantity * el.resource.spaceUsed,
      0
    );
  }
}
