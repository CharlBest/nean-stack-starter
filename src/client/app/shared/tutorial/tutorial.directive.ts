import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';

@Directive({
    selector: '[appTutorial]'
})
export class TutorialDirective implements OnInit {
    @Input('appTutorial') appTutorial: TutorialType;

    @HostBinding('style.background-color')
    @Input() tutorialBackgroundColor = 'white';

    tutorialInUrl: TutorialType;
    zIndex: string;

    constructor(private elementRef: ElementRef,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.zIndex = (<HTMLElement>this.elementRef.nativeElement).style.zIndex;
        this.route.queryParamMap.subscribe(params => {
            if (params.has('tut')) {
                this.tutorialInUrl = +params.get('tut');
                this.process(true);
            } else {
                this.process(false);
            }
        });
    }

    process(active: boolean) {
        if (active) {
            const element = (<HTMLElement>this.elementRef.nativeElement);

            if (this.tutorialInUrl !== this.appTutorial) {
                element.style.zIndex = this.zIndex;
            }

            if (this.tutorialInUrl === this.appTutorial) {
                element.style.zIndex = '11';
                window.scroll(null, element.offsetTop);
            }
        }
    }
}
