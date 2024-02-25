import { Pipe, PipeTransform } from '@angular/core';
import { ResourceType } from '../models/resources';
import { Inventory } from '../models/inventory';

@Pipe({
  name: 'inventoryTabUnlocked',
})
export class InventoryTabUnlockedPipe implements PipeTransform {
  transform(value: Inventory, tab: ResourceType, trigger: any): boolean {
    return value.resourcesTypes.includes(tab);
  }
}
