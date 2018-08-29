import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as marked from 'marked';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GitHubComponent implements OnInit {

  @Input() filePath: string;
  @Output() doneLoading: EventEmitter<void> = new EventEmitter<void>();
  readmeText: string;

  constructor() { }

  ngOnInit() {
    if (environment.production) {
      this.getMarkdownPage();
    } else {
      this.readmeText = 'IN DEVELOPMENT MODE';
    }
  }

  getMarkdownPage() {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener('load', (event) => {
      const content = (<XMLHttpRequest>event.target).responseText;
      this.readmeText = marked(content);
      this.doneLoading.emit();
    });

    oReq.open('GET', `https://raw.githubusercontent.com/CharlBest/nean-stack-starter/master/${this.filePath}.md`);
    oReq.send();
  }
}
