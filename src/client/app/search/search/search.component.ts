import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { SearchService } from '../search.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;
  items: ItemViewModel[] | null;
  pageIndex = 0;
  listEnd = false;

  constructor(public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private fb: FormBuilder,
    private location: Location,
    private searchService: SearchService,
    public navigationService: NavigationService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.search());
  }

  async search(newSearch = true) {
    let term = this.formGroup.controls.term.value;
    if (term) {
      this.isProcessing = true;

      term = term.trim();

      // Reset
      if (newSearch) {
        this.pageIndex = 0;
        this.listEnd = false;
        this.items = null;
      }

      try {
        const response = await this.searchService.search(term, this.pageIndex);
        if (response) {
          if (!this.items) {
            this.items = [];
          }

          this.items.push(...response);
        } else {
          this.items = [];
          this.listEnd = true;
        }
      } catch (error) {
        this.formErrorsService.updateFormValidity(error);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  back() {
    this.location.back();
  }

  onScroll() {
    if (!this.listEnd) {
      this.pageIndex++;
      this.search(false);
    }
  }

  trackByFn(index: number, item: ItemViewModel) {
    return item.id;
  }
}
