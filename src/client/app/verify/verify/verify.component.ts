import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { VerifyService } from '../verify.service';

@Component({
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  verifyResult: boolean;
  isProcessing = true;

  constructor(private verifyService: VerifyService,
    private route: ActivatedRoute,
    private router: Router,
    public formErrorsService: FormErrorsService) { }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.route.paramMap
      .subscribe(params => {
        if (params.has('code')) {
          this.verifyEmail(params.get('code'));
        }
      });
  }

  async verifyEmail(code: string | null) {
    if (code && code !== '') {
      try {
        const response = await this.verifyService.verifyEmail(code);
        if (response === true) {
          this.verifyResult = true;
        } else {
          this.verifyResult = false;
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
        this.verifyResult = false;
      } finally {
        this.isProcessing = false;
      }
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
