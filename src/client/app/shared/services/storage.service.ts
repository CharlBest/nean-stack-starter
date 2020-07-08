import { Injectable } from '@angular/core';

// The purpose of this service is to provide a central place to access local storage.
// This is needed because multiple account can have different storage data and needs
// to be prefixed accordingly

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  readonly storagePrefix = 'nean_data_';

  private localStorageData: StorageData = {
    consent: false,
    darkTheme: false,
    hasUserVisited: false
  };
  get storageData(): StorageData {
    return this.localStorageData;
  }

  private localUserData: UserData = {};
  get userData(): UserData {
    return this.localUserData;
  }

  setUserStorageData(data?: Partial<StorageData> | null): void {
    const updatedData = Object.assign(this.storageData, data);

    localStorage.setItem(`${this.storagePrefix}${this.userData.userId ? this.userData.userId : '_'}`,
      data ? JSON.stringify(updatedData) : '');
  }

  updateStoredData(): void {
    const data = localStorage.getItem(`${this.storagePrefix}${this.userData.userId ? this.userData.userId : '_'}`);
    if (data) {
      try {
        this.localStorageData = JSON.parse(data);
      } catch { }
    }
  }

  updateUserData(userId: number | null, tokenExpiry: number | null): void {
    this.localUserData.userId = userId;
    this.localUserData.tokenExpiry = tokenExpiry;
  }
}

export interface UserData {
  userId?: number | null;
  tokenExpiry?: number | null;
}

export interface StorageData {
  email?: string | null;
  username?: string | null;
  default?: boolean | null;
  token?: string | null;
  consent: boolean;
  darkTheme: boolean;
  language?: string | null;
  hasUserVisited: boolean;
}
