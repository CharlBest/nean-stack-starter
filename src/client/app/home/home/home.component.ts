import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { HomeService } from '../home.service';
import { environment } from '../../../environments/environment';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import * as marked from 'marked';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProcessing = true;
  readmeText: string;
  tutorialTypeEnum = TutorialType;

  constructor() { }

  ngOnInit() {
    if (environment.production) {
      this.getRepoReadme();
    } else {
      this.isProcessing = false;
      this.readmeText = 'IN DEVELOPMENT MODE';
    }
  }

  getRepoReadme() {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener('load', (event) => {
      const content = (<XMLHttpRequest>event.target).responseText;
      this.readmeText = marked(content);
      this.isProcessing = false;
    });

    oReq.open('GET', 'https://raw.githubusercontent.com/CharlBest/nean-stack-starter/master/README.md');
    oReq.send();
  }
}
