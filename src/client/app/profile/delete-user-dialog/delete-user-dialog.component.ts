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

    @Input() username: string;
    isProcessing = false;

    constructor(public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private profileService: ProfileService,
        private authService: AuthService,
        public bpService: BreakpointService) { }

    delete(username: string) {
        if (username === this.username) {
            this.isProcessing = true;

            this.snackBar.open('Deleting', '', {
                duration: 10000,
            });

            this.profileService.deleteUser()
                .pipe(finalize(() => this.isProcessing = false))
                .subscribe(() => {
                    this.dialog.closeAll();

                    this.authService.removeToken();
                    this.snackBar.dismiss();

                    this.snackBar.open('Deleted', '', {
                        duration: 2000,
                    });
                }, error => {
                });
        }
    }
}
