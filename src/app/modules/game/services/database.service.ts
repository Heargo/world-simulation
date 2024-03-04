import { Injectable } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ToastLevel } from '../../../core/models/toast-level';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db!: IDBDatabase;

  constructor(private toastService: ToastService) {
    const request = indexedDB.open('gameDB', 3);

    request.onupgradeneeded = event => {
      this.db = request.result;
      this.db.createObjectStore('games', {
        autoIncrement: true,
      });
    };

    request.onsuccess = event => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = function (event) {
      console.error('Error occurred while opening the database.');
    };
  }

  save<T>(store: string, data: T) {
    console.log('saveGame');
    const objectStore = this.db
      .transaction(store, 'readwrite')
      .objectStore(store);

    const request = objectStore.add(data);

    request.onerror = event => {
      console.error(
        'Error occurred while adding data to the database.',
        request.error
      );
      this.toastService.Show(
        'Error occurred while adding saving data',
        ToastLevel.Error
      );
    };

    request.onsuccess = event => {
      // Data added successfully
      console.log('Data added successfully');
      this.toastService.Show('Data saved successfully', ToastLevel.Success);
    };
  }

  async load<T>(store: string, id: number): Promise<T> {
    const objStore = this.db.transaction(store).objectStore(store);

    const r = objStore.get(id);

    //wait for the result (when r.onsuccess is called)
    return new Promise<T>((resolve, reject) => {
      r.onsuccess = () => {
        this.toastService.Show('Data loaded successfully', ToastLevel.Success);
        resolve(r.result);
      };
      r.onerror = () => {
        this.toastService.Show(
          'Error occurred while loading data',
          ToastLevel.Error
        );
        reject(r.error);
      };
    });
  }

  async list<T>(store: string): Promise<T[]> {
    const objStore = this.db.transaction(store).objectStore(store);

    const r = objStore.getAll();

    //wait for the result (when r.onsuccess is called)
    return new Promise<T[]>((resolve, reject) => {
      r.onsuccess = () => {
        this.toastService.Show('Data loaded successfully', ToastLevel.Success);
        resolve(r.result);
      };
      r.onerror = () => {
        this.toastService.Show(
          'Error occurred while loading data',
          ToastLevel.Error
        );
        reject(r.error);
      };
    });
  }
}
