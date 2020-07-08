import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as codeGenerator } from 'uuid';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';

@Component({
  templateUrl: './create-call.component.html',
  styleUrls: ['./create-call.component.scss']
})
export class CreateCallComponent implements OnInit {
  codeControl = new FormControl(this.route.snapshot.queryParams.code || codeGenerator());

  constructor(private shareService: ShareService,
    private shareDialogService: ShareDialogService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.updateCode();

    // Watch for changes
    this.route.queryParamMap
      .subscribe(params => {
        if (params.has('code')) {
          this.codeControl.setValue(params.get('code') || codeGenerator());
        } else {
          this.codeControl.setValue(codeGenerator());
        }
      });
  }

  updateCode(): void {
    this.router.navigate([], { queryParams: { code: this.codeControl.value }, queryParamsHandling: 'merge' });
  }

  share(): void {
    const url = ['/call'];
    const queryParams = { queryParams: { code: this.codeControl.value } };
    const title = 'Call Invite';
    if (!this.shareService.webShareWithUrl(title, url, queryParams)) {
      this.shareDialogService.share(title, url, queryParams);
    }
  }

  start(): void {
    this.router.navigate(['call'], { queryParams: { code: this.codeControl.value, host: true }, queryParamsHandling: 'merge' });
  }
}
