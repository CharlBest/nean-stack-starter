import { Component, OnInit, VERSION as AngularVersion } from '@angular/core';
import { VERSION as AngularMaterialVersion } from '@angular/material/core';
import { version } from '../../../../../package.json';
import { GitHubService } from '../../shared/github/github.service';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {
  isProcessingBestPractices = true;
  isProcessingChangelog = true;
  dataSource = [
    { description: 'GitHub package.json', version: null },
    { description: 'App package.json', version: `v${version}` },
    { description: 'Angular', version: `v${AngularVersion.full}` },
    { description: 'Angular Material', version: `v${AngularMaterialVersion.full}` },
  ];

  constructor(private gitHubService: GitHubService) { }

  ngOnInit() {
    this.getCurrentVersionInGitHubPackageJson();
  }

  getCurrentVersionInGitHubPackageJson() {
    this.gitHubService.getFile('package.json').subscribe(data => {
      const startIndex = data.indexOf('"version"');
      const endIndex = data.indexOf('",', startIndex);
      this.dataSource[0].version = `v${data.substring(startIndex + 12, endIndex)}`;
    });
  }
}
