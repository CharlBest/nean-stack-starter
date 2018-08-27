import { Component, OnInit } from '@angular/core';
import * as marked from 'marked';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GitHubComponent implements OnInit {

  isProcessing = true;
  readmeText: string;

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
        const container = document.getElementsByClassName('github-readme-container');
        const anchorLinks = container[0].getElementsByTagName('a');
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
