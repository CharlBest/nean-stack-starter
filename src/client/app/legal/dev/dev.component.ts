import { Component, OnInit, VERSION as AngularVersion } from '@angular/core';
import { VERSION as AngularMaterialVersion } from '@angular/material';

// TODO: Replace require import as soon as Angular supports Typescript 2.9
// import packageJson from '../../package.json';
// packageJson.version
declare function require(moduleName: string): any;
const { version: appVersion } = require('../../../../../package.json');

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {
  dataSource = [
    { description: 'Package.json', version: `v${appVersion}` },
    { description: 'Angular', version: `v${AngularVersion.full}` },
    { description: 'Angular Material', version: `v${AngularMaterialVersion.full}` },
  ];

  constructor() { }

  ngOnInit() {
  }
}
