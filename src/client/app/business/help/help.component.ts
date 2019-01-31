import { Component, OnInit } from '@angular/core';
import { PWAHelperService } from '../../shared/pwa-helper/pwa-helper.service';
import { PWAService } from '../../shared/pwa-helper/pwa.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(public pwaHelperService: PWAHelperService, public pwaService: PWAService) { }

  ngOnInit() {
  }
}
