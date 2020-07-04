import { Injectable } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { passwordList } from './password-list.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {

  constructor(private dialogService: DialogService) { }

  passCommonlyUsedTest(password: string): Promise<boolean> {
    if (passwordList.includes(password)) {
      return this.dialogService.confirm({
        title: 'Weak password',
        body: 'It seems your password is weak. Would you like to proceed?',
        confirmButtonText: 'Yes',
        closeButtonText: 'No'
      });
    } else {
      return Promise.resolve(true);
    }
  }
}
