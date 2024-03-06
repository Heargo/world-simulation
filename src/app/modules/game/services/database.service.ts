import { Injectable } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ToastLevel } from '../../../core/models/toast-level';
import { DbEntry } from '../models/db';

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
      const previewStore = this.db.createObjectStore('gamesPreview', {
        autoIncrement: true,
      });
      previewStore.createIndex('name', 'name', { unique: false });
      previewStore.createIndex('date', 'date', { unique: false });
      previewStore.createIndex('worldName', 'worldName', { unique: false });
      previewStore.createIndex('gameDataId', 'gameDataId', { unique: true });
    };

    request.onsuccess = event => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = function (event) {
      console.error('Error occurred while opening the database.');
    };
  }

  save<T>(store: string, data: T, id?: number): Promise<IDBValidKey> {
    const objectStore = this.db
      .transaction(store, 'readwrite')
      .objectStore(store);

    const request = objectStore.put(data, id);

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
      this.toastService.Show('Data saved successfully', ToastLevel.Success);
    };

    return new Promise<IDBValidKey>((resolve, reject) => {
      request.onsuccess = () => {
        this.toastService.Show('Data saved successfully', ToastLevel.Success);
        resolve(request.result);
      };
      request.onerror = () => {
        this.toastService.Show(
          'Error occurred while saving data',
          ToastLevel.Error
        );
        reject(request.error);
      };
    });
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

  async list<T>(store: string): Promise<DbEntry<T>[]> {
    const objStore = this.db.transaction(store).objectStore(store);

    const r = objStore.openCursor();
    const result: DbEntry<T>[] = [];

    //wait for the result (when r.onsuccess is called)
    return new Promise<DbEntry<T>[]>((resolve, reject) => {
      r.onsuccess = () => {
        this.toastService.Show('Data loaded successfully', ToastLevel.Success);
        const cursor = r.result;
        if (cursor) {
          result.push({ id: Number(cursor.key), data: cursor.value });
          cursor.continue();
        } else {
          resolve(result);
        }
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
