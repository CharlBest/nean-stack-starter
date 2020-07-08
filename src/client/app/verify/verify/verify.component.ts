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

  ngOnInit(): void {
    this.getParams();
  }

  getParams(): void {
    const code = this.route.snapshot.params.code;
    this.verifyEmail(code);
  }

  async verifyEmail(code: string | null): Promise<void> {
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

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
