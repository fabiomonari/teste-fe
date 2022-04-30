import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: Storage = window.localStorage;
  private consoleErrMsg = 'Essa versão do navegador não suporta localStorage';

  constructor() {}

  set(key: string, value: string): boolean {
    // verificando se o browser suporta localStorage
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    console.error(this.consoleErrMsg);
    return false;
  }

  get(key: string): any {
    if (this.storage) {
      return JSON.parse(this.storage.getItem(key) || '{}');
    }
    console.error(this.consoleErrMsg);
    return null;
  }

  remove(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    console.error(this.consoleErrMsg);
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    console.error(this.consoleErrMsg);
    return false;
  }
}
