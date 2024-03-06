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

  static fromJSON(data: Object) {
    let content: InventoryElement[] = [];
    if ((data as any).content) {
      for (const el of (data as any).content as any) {
        content.push({
          resource: Resource.fromJSON(el.resource),
          quantity: el.quantity,
        });
      }
    }
    (data as any).content = content;

    return Object.assign(new this(), data);
  }

  add(resource: Resource, quantity: number): void {
    const element = this.content.find(el => el.resource.key === resource.key);
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
    console.log('before', JSON.parse(JSON.stringify(this.content)));
    for (const key in resources) {
      const resource = this.content.find(el => el.resource.key === key);
      if (resource) {
        resource.quantity -= resources[key];
        if (resource.quantity <= 0) {
          this.content = this.content.filter(
            el => el.resource !== resource.resource
          );
        }
      }
    }
    console.log('after', JSON.parse(JSON.stringify(this.content)));
  }

  hasResources(resources?: { [key: string]: number }): boolean {
    if (!resources) return true;
    for (const key in resources) {
      const resource = this.content.find(el => el.resource.key === key);
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
