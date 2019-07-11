import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { parse } from 'marked';
import { environment } from '../../../../environments/environment';
import { GitHubService } from '../github.service';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GitHubComponent implements OnInit {

  @Input() filePath: string;
  @Output() doneLoading: EventEmitter<void> = new EventEmitter<void>();
  readmeText: string;

  constructor(private gitHubService: GitHubService) { }

  ngOnInit() {
    if (environment.production) {
      this.getMarkdownPage();
    } else {
      this.readmeText = 'IN DEVELOPMENT MODE';
      this.doneLoading.emit();
    }
  }

  async getMarkdownPage() {
    try {
      const response = await this.gitHubService.getFile(this.filePath);
      this.readmeText = parse(response);
      this.doneLoading.emit();
    } catch (error) {
      // TODO: error handling
    }
  }
}
