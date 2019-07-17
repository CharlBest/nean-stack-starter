import { TutorialType } from '@shared/view-models/tutorial/tutorial-type.enum';

export class Tutorial {
    constructor(public tutorialType: TutorialType,
        public text: string,
        public nextTutorial: TutorialType,
        public isFirst: boolean = false,
        public isLast: boolean = false) {
        this.tutorialType = tutorialType;
        this.text = text;
        this.nextTutorial = nextTutorial;
        this.isFirst = isFirst;
        this.isLast = isLast;
    }
}
