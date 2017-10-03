import { Component, Input } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../shared/auth.service';

@Component({
    selector: 'app-delete-user-dialog',
    templateUrl: './delete-user-dialog.component.html',
    styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent {

    @Input() username: string;

    constructor(public snackBar: MdSnackBar,
        public dialog: MdDialog,
        private profileService: ProfileService,
        private authService: AuthService) { }

    delete(username: string) {
        if (username === this.username) {
            this.dialog.closeAll();

            this.snackBar.open('Deleting', '', {
                duration: 10000,
            });

            this.profileService.deleteUser().subscribe(data => {
                this.authService.removeToken();
                this.snackBar.dismiss();

                this.snackBar.open('Deleted', '', {
                    duration: 2000,
                });
            });
        }
    }
}
