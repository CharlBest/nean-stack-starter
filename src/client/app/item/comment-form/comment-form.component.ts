import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { FormGroupBuilder } from '@shared/validation/form-group-builder';
import { CommentViewModel } from '@shared/view-models/item/comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Output() readonly submitForm: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly cancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(FormGroupDirective, { static: true }) formRef: FormGroupDirective;
  @Input() comment: CommentViewModel;
  formGroup: FormGroup;
  showButtons = false;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) { }

  ngOnInit() {
    this.formOnInit();

    // Show action buttons when updating
    if (this.formGroup.controls.description.value) {
      this.showButtons = true;
    }
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createOrUpdateComment(
      this.comment ? this.comment.description : null
    ));
  }

  cancelForm() {
    this.showButtons = false;
    this.cancel.emit();
  }
}
