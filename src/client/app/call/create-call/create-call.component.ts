import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as codeGenerator } from 'uuid';
import { ShareService } from '../../shared/services/share.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';

@Component({
  templateUrl: './create-call.component.html',
  styleUrls: ['./create-call.component.scss']
})
export class CreateCallComponent implements OnInit {
  code: string;

  constructor(private shareService: ShareService,
    private shareDialogService: ShareDialogService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code || codeGenerator();
    this.updateCode();

    // Watch for changes
    this.route.queryParamMap
      .subscribe(params => {
        if (params.has('code')) {
          this.code = params.get('code') || codeGenerator();
        } else {
          this.code = codeGenerator();
        }
      });
  }

  updateCode() {
    this.router.navigate([], { queryParams: { code: this.code }, queryParamsHandling: 'merge' });
  }

  share() {
    const url = ['/call'];
    const queryParams = { queryParams: { code: this.code } };
    const title = 'Call Invite';
    if (!this.shareService.webShareWithUrl(title, url, queryParams)) {
      this.shareDialogService.share(title, url, queryParams);
    }
  }

  start() {
    this.router.navigate(['call'], { queryParams: { code: this.code, host: true }, queryParamsHandling: 'merge' });
  }
}
