import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../dialog/dialog.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    @Output() readonly filtersUpdated: EventEmitter<void> = new EventEmitter<void>();
    tagsToFilter: Array<string> = [];
    get tags(): string | null {
        if (Array.isArray(this.tagsToFilter) && this.tagsToFilter.length > 0) {
            return this.tagsToFilter.join();
        } else {
            return null;
        }
    }

    constructor(private dialogService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.tagsToFilter = this.route.snapshot.queryParams.tags ? this.route.snapshot.queryParams.tags.split(',') : [];
    }

    async filterClick(tag: string): Promise<void> {
        if (this.tagsToFilter.indexOf(tag) > -1) {
            this.dialogService.alert({
                title: 'Notice',
                body: `You are already filtering on ${tag}`
            });
            return;
        }

        const hasConfirmed = await this.dialogService.confirm({
            title: 'Filter',
            body: `Are you sure you want to filter on ${tag}`,
            confirmButtonText: 'Proceed'
        });
        if (hasConfirmed) {
            // Add tag to filter
            this.tagsToFilter.push(tag);
            this.router.navigate([], { queryParams: { tags: this.tags }, queryParamsHandling: 'merge' });

            this.filtersUpdated.emit();

            this.snackBar.open(`Filter on ${tag}`, 'Undo')
                .onAction()
                .subscribe(() => {
                    this.snackBar.dismiss();
                    this.snackBar.open(`Undo filter ${tag}`);

                    this.removeFilter(this.tagsToFilter.length - 1);
                });
        }
    }

    removeFilter(index: number): void {
        // Remove tag to filter
        this.tagsToFilter.splice(index, 1);
        this.router.navigate([], { queryParams: { tags: this.tags }, queryParamsHandling: 'merge' });

        this.filtersUpdated.emit();
    }

    trackByFn(index: number, tag: string): number {
        return index;
    }
}
