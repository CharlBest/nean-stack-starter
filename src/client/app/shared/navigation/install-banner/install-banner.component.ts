import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PWAService } from '../../pwa-helper/pwa.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-install-banner',
  templateUrl: './install-banner.component.html',
  styleUrls: ['./install-banner.component.scss']
})
export class InstallBannerComponent implements OnInit {

  @Input() toolbarHeight: number;
  @Output() readonly showInstallBanner: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public navigationService: NavigationService,
    public pwaService: PWAService) { }

  ngOnInit() {
    this.navigationService.showInstallBanner = this.pwaService.canInstallAndNotInPWA;

    // Watch for before install prompt to show install banner
    this.pwaService.beforeInstallPromptChange.subscribe(() => {
      if (this.pwaService.canInstallAndNotInPWA) {
        this.updateInstallBanner(true);
      }
    });
  }

  updateInstallBanner(canShowInstallBanner: boolean) {
    this.navigationService.showInstallBanner = canShowInstallBanner;
    this.showInstallBanner.emit(canShowInstallBanner);
  }
}
