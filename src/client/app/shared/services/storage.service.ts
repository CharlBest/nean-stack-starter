import { Injectable } from '@angular/core';
import { UserService } from './user.service';

// The purpose of this service is to provide a central place to access local storage.
// This is needed because multiple account can have different storage data and needs
// to be prefixed accordingly

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private userService: UserService) { }

  getItem(key: string): string | null {
    return localStorage.getItem(this.concatKeyPrefix(key));
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.concatKeyPrefix(key));
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(this.concatKeyPrefix(key), value);
  }

  concatKeyPrefix(key: string, prefix: number | null | undefined = this.userService.storedLoggedInUserId) {
    return `${prefix ? prefix : '_'}_${key}`;
  }

}

export const enum StorageKey {
  TOKEN = 'token',
  IS_DARK_THEME = 'is_dark_theme',
  LANGUAGE = 'language',
  COOKIE_CONSENT = 'cookie_consent',
  HAS_USER_VISITED = 'has_user_visited'
}
