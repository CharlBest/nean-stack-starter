import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PWAService } from '../../pwa-helper/pwa.service';

@Component({
  selector: 'app-install-banner',
  templateUrl: './install-banner.component.html',
  styleUrls: ['./install-banner.component.scss']
})
export class InstallBannerComponent implements OnInit {

  @Input() toolbarHeight: number;
  canShowInstallBanner = this.pwaService.canInstallAndNotInPWA;
  @Output() showInstallBanner: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public pwaService: PWAService) { }

  ngOnInit() {
    // Watch for before install prompt to show install banner
    this.pwaService.beforeInstallPromptChange.subscribe(() => {
      if (this.pwaService.canInstallAndNotInPWA) {
        this.updateInstallBanner(true);
      }
    });
  }

  updateInstallBanner(canShowInstallBanner: boolean) {
    this.canShowInstallBanner = canShowInstallBanner;
    this.showInstallBanner.emit(canShowInstallBanner);
  }
}
