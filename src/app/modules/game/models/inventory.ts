import { Resource, ResourceType } from './resources';

export interface InventoryElement {
  resource: Resource;
  quantity: number;
}

export class Inventory {
  content: InventoryElement[];
  resourcesTypes: ResourceType[];
  constructor(content: InventoryElement[] = []) {
    this.content = content;
    this.resourcesTypes = [];
    for (const el of content) {
      if (!this.resourcesTypes.includes(el.resource.type)) {
        this.resourcesTypes.push(el.resource.type);
      }
    }
  }

  add(resource: Resource, quantity: number): void {
    const element = this.content.find(el => el.resource === resource);
    if (element) {
      element.quantity += quantity;
    } else {
      this.content.push({ resource, quantity });
    }
    //update resources types
    if (!this.resourcesTypes.includes(resource.type)) {
      this.resourcesTypes.push(resource.type);
    }
  }

  remove(resource: Resource, quantity: number): void {
    const element = this.content.find(el => el.resource === resource);
    if (element) {
      element.quantity -= quantity;
      if (element.quantity <= 0) {
        this.content = this.content.filter(el => el.resource !== resource);
        //update resources types if all resources of this type are removed
        if (
          this.content.filter(el => el.resource.type === resource.type)
            .length === 0
        ) {
          this.resourcesTypes = this.resourcesTypes.filter(
            el => el !== resource.type
          );
        }
      }
    }
  }

  removeMultiple(resources: { [key: string]: number }): void {
    for (const key in resources) {
      const resource = this.content.find(el => el.resource.name === key);
      if (resource) {
        resource.quantity -= resources[key];
        if (resource.quantity <= 0) {
          this.content = this.content.filter(
            el => el.resource !== resource.resource
          );
        }
      }
    }
  }

  hasResources(resources?: { [key: string]: number }): boolean {
    if (!resources) return true;
    for (const key in resources) {
      const resource = this.content.find(el => el.resource.name === key);
      if (!resource || resource.quantity < resources[key]) return false;
    }
    return true;
  }

  getTotalSize(): number {
    return this.content.reduce(
      (acc, el) => acc + el.quantity * el.resource.spaceUsed,
      0
    );
  }
}
