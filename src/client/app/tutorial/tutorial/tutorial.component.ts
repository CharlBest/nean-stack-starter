import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorialArea, TutorialService, Tutorial } from '../../tutorial/tutorial.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  type: TutorialArea;
  tutorial: Tutorial;
  returnUrl: string;
  tutorialTypeEnum = TutorialArea;
  help = false;

  // TODO: tutorials will work beter as dialogs than seperate pages - I think
  // TODO: tutorials should actually be saves in db

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private tutorialService: TutorialService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('type')) {
        this.type = +params.get('type');
        this.help = this.route.snapshot.queryParams['help'] === 'true';

        this.hasDoneTutorial();
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      if (queryParams.has('help')) {
        this.help = queryParams.get('help') === 'true';
        this.type = +this.route.snapshot.params['type'];

        this.hasDoneTutorial();
      }
    });
  }

  hasDoneTutorial() {
    if (this.tutorialService.hasDoneTutorial(this.type) && !this.help) {
      this.router.navigate(['/']);
    }
  }

  onDone(area: TutorialArea) {
    this.tutorialService.setTutorialAsDone(area);

    this.location.back();
  }
}
