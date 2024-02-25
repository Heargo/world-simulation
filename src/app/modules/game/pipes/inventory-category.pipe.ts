import { Pipe, PipeTransform } from '@angular/core';
import { ResourceType } from '../models/resources';
import { Inventory, InventoryElement } from '../models/inventory';

@Pipe({
  name: 'inventoryCategory',
})
export class InventoryCategoryPipe implements PipeTransform {
  transform(value: Inventory, resourceType?: ResourceType): InventoryElement[] {
    if (!resourceType) {
      return [];
    }
    return value.content.filter(
      r => r.resource.type === (resourceType as ResourceType)
    );
  }
}
