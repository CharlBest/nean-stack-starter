import { Component, OnInit } from '@angular/core';
import { NetworkStatusService } from '../network-status.service';

@Component({
    selector: 'app-network-status',
    templateUrl: './network-status.component.html',
    styleUrls: ['./network-status.component.scss']
})
export class NetworkStatusComponent implements OnInit {
    isOnline: boolean;
    constructor(public networkStatusService: NetworkStatusService) { }
    ngOnInit() {
        this.networkStatusService.isOffline$.subscribe(data => this.isOnline = !data);
    }
}
