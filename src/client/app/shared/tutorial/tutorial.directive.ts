import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';

@Directive({
    selector: '[appTutorial]'
})
export class TutorialDirective implements OnInit {
    @Input() appTutorial: TutorialType;
    @Input() tutorialBackgroundColor = 'none';

    private tutorialInUrl: TutorialType;
    private zIndex: string;
    private backgroundColor: string;

    constructor(private elementRef: ElementRef,
        private route: ActivatedRoute) { }

    ngOnInit() {
        const elementStyle = (<HTMLElement>this.elementRef.nativeElement).style;
        this.zIndex = elementStyle.zIndex;
        this.backgroundColor = elementStyle.backgroundColor;


        this.route.queryParamMap
            .subscribe(params => {
                if (params.has('tut')) {
                    this.tutorialInUrl = +params.get('tut');
                    this.process();
                } else {
                    this.reset();
                }
            });
    }

    process() {
        const element = (<HTMLElement>this.elementRef.nativeElement);

        // Hidden tutorial item
        if (this.tutorialInUrl !== this.appTutorial) {
            this.reset();
        }

        // Shown tutorial item
        if (this.tutorialInUrl === this.appTutorial) {
            element.style.zIndex = '11';
            element.style.backgroundColor = this.tutorialBackgroundColor;
            window.scroll(null, element.offsetTop);
        }
    }

    reset() {
        const element = (<HTMLElement>this.elementRef.nativeElement);
        element.style.zIndex = this.zIndex;
        element.style.backgroundColor = this.backgroundColor;
    }
}
