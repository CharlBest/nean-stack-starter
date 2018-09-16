import { Component, Input, OnInit } from '@angular/core';
import { CommentViewModel } from '../../../../shared/view-models/item/comment.view-model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentViewModel;

  constructor() { }

  ngOnInit() {
  }
}
