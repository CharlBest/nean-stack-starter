import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorialService } from '../tutorial.service';
import { TutorialType } from '../tutorial-type.enum';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  tutorialTypeEnum = TutorialType;
  tutorialInUrl: TutorialType;
  active: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private tutorialService: TutorialService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('tut')) {
        this.tutorialInUrl = +params.get('tut');
        this.active = true;
      } else {
        this.tutorialInUrl = null;
        this.active = false;
      }
    });
  }

  exitTutorial() {
    this.tutorialService.deactivateTutorial();
  }

  goToTutorial(tutorialType: TutorialType) {
    this.tutorialService.activateTutorial(tutorialType);
  }
}
