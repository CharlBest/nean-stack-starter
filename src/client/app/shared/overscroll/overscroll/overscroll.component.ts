import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverscrollService } from '../overscroll.service';

@Component({
  selector: 'app-overscroll',
  templateUrl: './overscroll.component.html',
  styleUrls: ['./overscroll.component.scss']
})
export class OverscrollComponent implements OnInit, OnDestroy {

  @Input() isProcessing = false;
  @Output() readonly overscrolled: EventEmitter<void> = new EventEmitter<void>();
  overscrollSubscription: Subscription;

  constructor(private overscrollService: OverscrollService) { }

  ngOnInit() {
    this.overscrollSubscription = this.overscrollService.overscrolled.subscribe(() => {
      this.overscrolled.emit();
    })
  }

  ngOnDestroy() {
    if (this.overscrollSubscription) {
      this.overscrollSubscription.unsubscribe();
    }
  }
}
