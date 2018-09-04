import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../shared/dialog/dialog.service';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  formGroup: FormGroup;
  isProcessing = false;

  constructor(public formErrorsService: FormErrorsService,
    public bpService: BreakpointService,
    private fb: FormBuilder,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group({
      term: [null, Validators.required]
    });
  }

  onSubmit() {
    this.dialogService.alert('This feature is not yet implemented');
  }
}
