import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { CreateItemViewModel } from '../../../../shared/view-models/item/create-item.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { CreateItemService } from '../create-item.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  formGroup: FormGroup;
  isProcessing = false;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    private createItemService: CreateItemService,
    public bpService: BreakpointService,
    private router: Router) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(BuildFormGroup.createItem());
  }

  createItem() {
    this.isProcessing = true;

    const viewModel = new CreateItemViewModel();
    viewModel.title = this.formGroup.get('title').value;
    viewModel.description = this.formGroup.get('description').value;

    this.createItemService.create(viewModel)
      .pipe(finalize(() => this.isProcessing = false))
      .subscribe(data => {
        this.router.navigate(['/']);
      }, error => {
        this.formErrorsService.updateFormValidity(error, this.formGroup);
      });
  }
}
