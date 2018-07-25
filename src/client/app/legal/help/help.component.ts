import { Component, OnInit } from '@angular/core';
import { PWAHelperService } from '../../shared/pwa-helper/pwa-helper.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(private pwaHelperService: PWAHelperService) { }

  ngOnInit() {
  }

  openPWAHelper() {
    this.pwaHelperService.open()
  }
}
