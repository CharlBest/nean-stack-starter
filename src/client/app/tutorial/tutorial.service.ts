import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TutorialService {

  tutorials: Tutorial[] = [
    {
      version: 1,
      type: TutorialArea.firstTimeUser
    },
    {
      version: 1,
      type: TutorialArea.createPost
    },
  ];

  constructor(private http: HttpClient) { }

  hasDoneTutorial(area: TutorialArea): boolean {
    const filteredTutorials = this.tutorials.filter(x => x.type === area);
    if (filteredTutorials[0] !== null) {
      const localTutorial = localStorage.getItem(`tutorial_${area}_${filteredTutorials[0].version}`);
      if (localTutorial === 'true') {
        return true;
      } else {
        return false;
      }
    } else {
      console.error('tutorial area does not exist!');
    }
  }

  setTutorialAsDone(area: TutorialArea) {
    const currentVersion = this.tutorials.filter(x => x.type === area)[0].version;
    localStorage.setItem(`tutorial_${area}_${currentVersion}`, 'true');
  }
}

export enum TutorialArea {
  firstTimeUser = 1,
  createPost = 2
}

export class Tutorial {
  version: number;
  type: TutorialArea;
}

