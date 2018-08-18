import { Component, OnInit } from '@angular/core';
import * as marked from 'marked';
import { TutorialType } from '../../../../shared/view-models/tutorial/tutorial-type.enum';
import { environment } from '../../../environments/environment';

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

      //Remove DEMO link in text
      setTimeout(() => {
        const anchorLinks = document.getElementsByTagName('a');
        for (var i = 0; i < anchorLinks.length; i++) {
          if (anchorLinks[i].href === 'https://nean.io/') {
            anchorLinks[i].remove();
          }
        }
      }, 100);
    });

    oReq.open('GET', 'https://raw.githubusercontent.com/CharlBest/nean-stack-starter/master/README.md');
    oReq.send();
  }
}
