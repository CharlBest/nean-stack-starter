import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GitHubComponent } from './github/github.component';

const materialModules = [
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [
    GitHubComponent
  ],
  exports: [
    GitHubComponent
  ]
})
export class GitHubModule { }
