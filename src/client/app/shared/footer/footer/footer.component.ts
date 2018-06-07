import { Component } from '@angular/core';

// TODO: Replace require import as soon as Angular supports Typescript 2.9
// import packageJson from '../../package.json';
// packageJson.version
declare function require(moduleName: string): any;
const { version: appVersion } = require('../../../../../../package.json');

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    appVersion = appVersion;
}
