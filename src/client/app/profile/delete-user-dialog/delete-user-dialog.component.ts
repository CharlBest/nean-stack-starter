import { Component, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../shared/auth.service';
import { BreakpointService } from '../../shared/breakpoint.service';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-delete-user-dialog',
    templateUrl: './delete-user-dialog.component.html',
    styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent {

    @Input() email: string;
    isProcessing = false;

    constructor(public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private profileService: ProfileService,
        private authService: AuthService,
        public bpService: BreakpointService) { }

    delete(email: string) {
        if (email === this.email) {
            this.isProcessing = true;

            this.snackBar.open('Deleting...', null, {
                duration: 10000,
            });

            this.profileService.deleteUser()
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.dialog.closeAll();

                    this.authService.removeToken();
                    this.snackBar.dismiss();

                    this.snackBar.open('Deleted', null, {
                        duration: 2000,
                    });
                }, error => {
                    this.snackBar.dismiss();
                    this.snackBar.open('Deleting failed', null, {
                        duration: 2000,
                    });
                });
        }
    }
}
