import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { UpdateTwoFactorAuthenticationViewModel } from '@shared/view-models/user/update-two-factor-authentication.view-model';
import { toCanvas } from 'qrcode';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ShareService } from '../../shared/services/share.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  @Input() twoFactorAuthenticationEnabled: boolean;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  sanitizedQRCodeKeyUri: SafeUrl;
  secret: string;
  formGroup: FormGroup;
  isProcessing = false;
  shouldRevealCode = false;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private profileService: ProfileService,
    private dialogService: DialogService,
    private shareService: ShareService,
    public bpService: BreakpointService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.updateTwoFactorAuthentication(this.twoFactorAuthenticationEnabled));
  }

  async getAndUpdateTwoFactorAuthentication() {
    this.isProcessing = true;

    const viewModel = new UpdateTwoFactorAuthenticationViewModel();
    viewModel.isEnabled = this.formGroup.controls.twoFactorAuthenticationEnabled.value;

    try {
      const response = await this.profileService.updateTwoFactorAuthentication(viewModel);

      // Instructions
      if (viewModel.isEnabled) {
        this.dialogService.alert({
          title: 'Remember',
          body: 'Scan your QR Code or store your secret code somewhere safe'
        });
      }

      this.generateQRCode(response.qrCodeKeyUri, viewModel.isEnabled);
    } catch (error) {
      this.formErrorsService.updateFormValidity(error, this.formGroup);
    } finally {
      this.isProcessing = false;
    }
  }

  generateQRCode(qrCodeKeyUri: string, shouldRevealCode: boolean) {
    // Show/Hide QR Code
    this.shouldRevealCode = shouldRevealCode;

    // Draw QR Code
    toCanvas(this.canvas.nativeElement, qrCodeKeyUri, (error) => {
      // TODO: error handling
    });

    // Extract secret key
    const startWord = 'secret=';
    const startIndex = qrCodeKeyUri.indexOf(startWord) + startWord.length;
    const endIndex = qrCodeKeyUri.indexOf('&', startIndex);

    this.secret = qrCodeKeyUri.substring(startIndex, endIndex);
    this.sanitizedQRCodeKeyUri = this.domSanitizer.bypassSecurityTrustUrl(qrCodeKeyUri);
  }

  copy() {
    this.shareService.copy(this.secret);
    return false;
  }
}
