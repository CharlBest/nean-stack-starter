import { Injectable } from '@angular/core';

// The purpose of this service is to provide a central place to access local storage.
// This is needed because multiple account can have different storage data and needs
// to be prefixed accordingly

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  readonly storagePrefix = 'nean_';

  private localStorageData: StorageData = {
    consent: false,
    darkTheme: false,
    hasUserVisited: false
  };
  get storageData() {
    return this.localStorageData;
  }

  private localUserData: UserData = {};
  get userData() {
    return this.localUserData;
  }

  constructor() { }

  setUserStorageData(data?: Partial<StorageData> | null) {
    const updatedData = Object.assign(this.storageData, data);

    localStorage.setItem(`nean_data_${this.userData.userId ? this.userData.userId : '_'}`, data ? JSON.stringify(updatedData) : '');
  }

  updateStoredData() {
    const data = localStorage.getItem(`nean_data_${this.userData.userId ? this.userData.userId : '_'}`);
    if (data) {
      try {
        this.localStorageData = JSON.parse(data);
      } catch { }
    }
  }

  updateUserData(userId: number | null, tokenExpiry: number | null) {
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
