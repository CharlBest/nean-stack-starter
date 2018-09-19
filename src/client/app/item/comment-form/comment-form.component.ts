import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { BuildFormGroup } from '../../../../shared/validation/validators';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';
import { FormErrorsService } from '../../shared/form-errors/form-errors.service';
import { BreakpointService } from '../../shared/services/breakpoint.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
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
    this.formGroup = this.fb.group(BuildFormGroup.createOrUpdateComment(
      this.comment ? this.comment.description : null
    ));
  }
}
