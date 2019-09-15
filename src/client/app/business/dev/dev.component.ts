import { Component, OnInit, VERSION as angularVersion } from '@angular/core';
import { VERSION as angularMaterialVersion } from '@angular/material/core';
import { version } from '../../../../../package.json';
import { GitHubService } from '../../shared/github/github.service';

@Component({
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {
  isProcessingBestPractices = true;
  isProcessingChangelog = true;
  dataSource = [
    { description: 'GitHub package.json', version: null },
    { description: 'App package.json', version: `v${version}` },
    { description: 'Angular', version: `v${angularVersion.full}` },
    { description: 'Angular Material', version: `v${angularMaterialVersion.full}` },
  ];

  constructor(private gitHubService: GitHubService) { }

  ngOnInit() {
    this.getCurrentVersionInGitHubPackageJson();
  }

  async getCurrentVersionInGitHubPackageJson() {
    try {
      const response = await this.gitHubService.getFile('package.json');
      const startIndex = response.indexOf('"version"');
      const endIndex = response.indexOf('",', startIndex);
      this.dataSource[0].version = `v${response.substring(startIndex + 12, endIndex)}`;
    } catch (error) {
      // TODO: error handling
    }
  }
}
