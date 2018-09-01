import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-github-readme',
  templateUrl: './github-readme.component.html',
  styleUrls: ['./github-readme.component.scss']
})
export class GitHubReadMeComponent implements OnInit {

  isProcessing = true;

  constructor() { }

  ngOnInit() {
  }

  doneLoading() {
    // Remove DEMO link in text
    setTimeout(() => {
      const container = document.getElementsByClassName('github-readme-container');
      if (container && container[0]) {
        const anchorLinks = container[0].getElementsByTagName('a');
        for (let i = 0; i < anchorLinks.length; i++) {
          if (anchorLinks[i].href === 'https://nean.io/') {
            anchorLinks[i].remove();
          }
        }
      }

      this.isProcessing = false;
    }, 100);
  }
}
