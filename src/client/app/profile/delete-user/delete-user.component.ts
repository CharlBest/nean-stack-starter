import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { ProfileService } from '../profile.service';

@Component({
    templateUrl: './delete-user.component.html',
    styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

    email: string | null;
    isProcessing = false;

    constructor(private snackBar: MatSnackBar,
        private profileService: ProfileService,
        private route: ActivatedRoute,
        private authService: AuthService,
        public bpService: BreakpointService) { }

    ngOnInit(): void {
        this.getParams();
    }

    getParams(): void {
        this.email = this.route.snapshot.queryParams.email;
    }

    async delete(email: string): Promise<void> {
        if (this.email && email === this.email) {
            this.isProcessing = true;

            this.snackBar.open('Deleting...');

            try {
                await this.profileService.deleteUser();

                this.authService.removeTokenAndNavigateToLogin();
                this.snackBar.dismiss();

                this.snackBar.open('Deleted');
            } catch (error) {
                this.snackBar.dismiss();
                this.snackBar.open('Deleting failed');
            } finally {
                this.isProcessing = false;
            }
        }
    }
}
