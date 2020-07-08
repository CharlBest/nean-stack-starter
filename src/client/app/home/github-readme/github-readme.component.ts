import { Component } from '@angular/core';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-github-readme',
  templateUrl: './github-readme.component.html',
  styleUrls: ['./github-readme.component.scss']
})
export class GitHubReadMeComponent {

  isProcessing = true;

  constructor(public themeService: ThemeService) { }

  doneLoading(): void {
    // Remove DEMO link in text
    window.setTimeout(() => {
      const container = document.getElementsByClassName('github-readme-container');
      if (container && container[0]) {
        const anchorLinks = container[0].getElementsByTagName('a');
        for (const link of Array.from(anchorLinks)) {
          if (link.href === 'https://nean.io/') {
            link.remove();
          }
        }
      }

      this.isProcessing = false;
    }, 100);
  }
}
