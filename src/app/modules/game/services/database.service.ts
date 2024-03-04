import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  db!: IDBDatabase;

  constructor() {
    const request = indexedDB.open('gameDB', 3);

    request.onupgradeneeded = event => {
      this.db = request.result;
      this.db.createObjectStore('games', {
        autoIncrement: true,
      });
    };

    request.onsuccess = event => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('database opened successfully');
    };

    request.onerror = function (event) {
      // Error occurred while opening the database
      console.error('Error occurred while opening the database.');
    };
  }

  save<T>(store: string, data: T) {
    console.log('saveGame');
    const objectStore = this.db
      .transaction(store, 'readwrite')
      .objectStore(store);
    objectStore.add(data);
  }

  load<T>(store: string, id: number): T {
    console.log('loadGame');
    return {} as T;
  }

  async list<T>(store: string): Promise<T[]> {
    const objStore = this.db.transaction(store).objectStore(store);

    const r = objStore.getAll();

    //wait for the result (when r.onsuccess is called)
    return new Promise<T[]>((resolve, reject) => {
      r.onsuccess = () => {
        resolve(r.result);
      };
      r.onerror = () => {
        reject(r.error);
      };
    });
  }
}
