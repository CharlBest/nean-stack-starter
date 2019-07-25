import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { toCanvas } from 'qrcode';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  secret = 'MYZEERBYMFRVC3DXJV4EE6KHOVVGKSLM';

  constructor() { }

  ngOnInit() {
    toCanvas(this.canvas.nativeElement, 'otpauth://totp/otplib:demo?secret=MYZEERBYMFRVC3DXJV4EE6KHOVVGKSLM&issuer=otplib', (error) => {
      // TODO: error handling
    });
  }

  revealCode() {

  }
}
