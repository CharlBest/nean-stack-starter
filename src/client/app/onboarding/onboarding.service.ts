import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService, StorageKey } from '../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private router: Router,
    private localStorageService: LocalStorageService) { }

  openOnboarding(): boolean {
    const hasUserVisited = this.hasUserVisited();
    this.setUserVisited();

    // TODO: hack to never show cookie consent on the onboarding page
    const isOnboarding = location.pathname.startsWith('/onboarding');
    if (isOnboarding) {
      return true;
    }

    if (!hasUserVisited && location.pathname === '/') {
      this.router.navigate(['/onboarding']);
      return true;
    }

    return false;
  }

  hasUserVisited() {
    return this.localStorageService.getItem(StorageKey.HAS_USER_VISITED) === 'true';
  }

  setUserVisited() {
    this.localStorageService.setItem(StorageKey.HAS_USER_VISITED, 'true');
  }
}
