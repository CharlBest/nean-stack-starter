import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private router: Router,
    private localStorageService: LocalStorageService) { }

  openOnboarding(): boolean {
    const hasUserVisited = this.localStorageService.storageData.hasUserVisited;
    this.localStorageService.setUserStorageData({ hasUserVisited: true });

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
}
