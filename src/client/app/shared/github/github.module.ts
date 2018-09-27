import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GitHubComponent } from './github/github.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GitHubComponent
  ],
  exports: [
    GitHubComponent
  ]
})
export class GitHubModule { }
