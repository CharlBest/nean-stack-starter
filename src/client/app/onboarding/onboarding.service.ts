import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private readonly hasVisitedStorageKey = 'has_user_visited';

  constructor(private router: Router) { }

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
    return localStorage.getItem(this.hasVisitedStorageKey) === 'true';
  }

  setUserVisited() {
    localStorage.setItem(this.hasVisitedStorageKey, 'true');
  }
}
