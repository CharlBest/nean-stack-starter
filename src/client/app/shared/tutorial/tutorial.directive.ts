import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';

@Directive({
    selector: '[appTutorial]'
})
export class TutorialDirective implements OnInit {
    @Input() appTutorial: keyof typeof TutorialType;
    @Input() tutorialBackgroundColor = 'none';

    private tutorialInUrl: TutorialType | null;
    private zIndex: string | null;
    private backgroundColor: string | null;

    constructor(private elementRef: ElementRef<HTMLElement>,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.initialize();
        this.getParams();
    }

    initialize() {
        this.zIndex = this.elementRef.nativeElement.style.zIndex;
        this.backgroundColor = this.elementRef.nativeElement.style.backgroundColor;
    }

    getParams() {
        this.route.queryParamMap
            .subscribe(params => {
                if (params.has('tut')) {
                    const tut = params.get('tut');
                    if (tut) {
                        this.tutorialInUrl = +tut;
                    }
                    this.process();
                } else {
                    this.reset();
                }
            });
    }

    process() {
        // Hidden tutorial item
        if (this.tutorialInUrl !== TutorialType[this.appTutorial]) {
            this.reset();
        }

        // Shown tutorial item
        if (this.tutorialInUrl === TutorialType[this.appTutorial]) {
            this.elementRef.nativeElement.style.zIndex = '11';
            this.elementRef.nativeElement.style.backgroundColor = this.tutorialBackgroundColor;
            window.scroll(0, this.elementRef.nativeElement.offsetTop);
        }
    }

    reset() {
        if (this.zIndex) {
            this.elementRef.nativeElement.style.zIndex = this.zIndex;
        }
        if (this.backgroundColor) {
            this.elementRef.nativeElement.style.backgroundColor = this.backgroundColor;
        }
    }
}
