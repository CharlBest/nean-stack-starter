import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
  @Input() options = {};
  @Input() isProcessing: boolean;
  @Output() readonly scrolled = new EventEmitter<void>();
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('anchor', { static: true }) anchor: ElementRef<HTMLElement>;
  get element() {
    return this.host.nativeElement;
  }

  private observer: IntersectionObserver;

  constructor(private host: ElementRef<HTMLElement>) { }

  ngOnInit() {
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isProcessing && this.wrapper.nativeElement.childElementCount > 0) {
        this.scrolled.emit();
      }
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }

  private isHostScrollable() {
    const style = window.getComputedStyle(this.element);

    return style.getPropertyValue('overflow') === 'auto' ||
      style.getPropertyValue('overflow-y') === 'scroll';
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
