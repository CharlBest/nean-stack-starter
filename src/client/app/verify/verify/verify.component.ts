import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyService } from '../verify.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  code: string;
  verifyResult: boolean;
  isProcessing = true;

  constructor(private verifyService: VerifyService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        if (params.has('code')) {
          this.code = params.get('code');

          if (this.code !== undefined && this.code !== '') {
            this.verifyService.verifyEmail(this.code)
              .subscribe(data => {
                if (data === true) {
                  this.verifyResult = true;
                } else {
                  this.verifyResult = false;
                }
                this.isProcessing = false;
              }, error => {
                this.verifyResult = false;
                this.isProcessing = false;
              });
          }
        }
      });
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
