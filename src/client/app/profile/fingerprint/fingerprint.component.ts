import { Component } from '@angular/core';
import { create, get, supported } from '@github/webauthn-json';
import { PublicKeyCredentialDescriptorJSON, PublicKeyCredentialWithAttestationJSON } from '@github/webauthn-json/dist/src/json';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.scss']
})
export class FingerprintComponent {

  get isSupported() {
    return supported();
  }

  registeredCredentials(): PublicKeyCredentialDescriptorJSON[] {
    return this.getRegistrations().map((reg) => ({
      id: reg.rawId,
      type: reg.type
    }));
  }

  async register(): Promise<void> {
    this.saveRegistration(await create({
      publicKey: {
        challenge: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        rp: { name: 'Localhost, Inc.' },
        user: { id: 'IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII', name: 'test_user', displayName: 'Test User' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        excludeCredentials: this.registeredCredentials()
      }
    }));
  }

  async authenticate(): Promise<void> {
    await get({
      publicKey: {
        challenge: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        allowCredentials: this.registeredCredentials()
      }
    });
  }

  async clear(): Promise<void> {
    this.setRegistrations([]);
  }

  getRegistrations(): PublicKeyCredentialWithAttestationJSON[] {
    return JSON.parse(localStorage.webauthnExampleRegistrations || '[]');
  }

  setRegistrations(registrations: PublicKeyCredentialWithAttestationJSON[], display: boolean = true): void {
    localStorage.webauthnExampleRegistrations = JSON.stringify(registrations, null, '  ');
  }

  saveRegistration(registration: PublicKeyCredentialWithAttestationJSON): void {
    const registrations = this.getRegistrations();
    registrations.push(registration);
    this.setRegistrations(registrations);
  }

}
