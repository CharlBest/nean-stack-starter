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

  @Output() submitForm: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(FormGroupDirective, { static: true }) formRef: FormGroupDirective;
  @Input() comment: CommentViewModel;
  formGroup: FormGroup;
  showCommentSubmitButton = false;

  constructor(private fb: FormBuilder,
    public formErrorsService: FormErrorsService,
    public bpService: BreakpointService) { }

  ngOnInit() {
    this.formOnInit();
  }

  formOnInit() {
    this.formGroup = this.fb.group(FormGroupBuilder.createOrUpdateComment(
      this.comment ? this.comment.description : null
    ));
  }
}
