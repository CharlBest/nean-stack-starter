import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { ItemViewModel } from '../../../../shared/view-models/item/item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;
  items: ItemViewModel[];

  constructor(public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private fb: FormBuilder,
    private location: Location,
    private searchService: SearchService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.search());
  }

  onSubmit() {
    let term = this.formGroup.controls.term.value;
    if (term) {
      this.isProcessing = true;

      term = term.trim();

      this.searchService.search(term, 0)
        .pipe(finalize(() => this.isProcessing = false))
        .subscribe(data => {
          if (data) {
            this.items = data;
          } else {
            this.items = [];
          }
        }, error => {
          this.formErrorsService.updateFormValidity(error);
        });
    }
  }

  back() {
    this.location.back();
  }
}
