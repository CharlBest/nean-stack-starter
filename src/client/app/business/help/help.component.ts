import { Component } from '@angular/core';
import { PWAHelperService } from '../../shared/pwa-helper/pwa-helper.service';
import { PWAService } from '../../shared/pwa-helper/pwa.service';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  constructor(public pwaHelperService: PWAHelperService, public pwaService: PWAService) { }
}
