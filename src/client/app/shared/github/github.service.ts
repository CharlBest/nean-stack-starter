import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  getFile(filePath: string) {
    const req = new XMLHttpRequest();
    const req$ = fromEvent(req, 'load')
      .pipe(
        map(event => (<XMLHttpRequest>event.target).responseText)
      );

    req.open('GET', `https://raw.githubusercontent.com/CharlBest/nean-stack-starter/master/${filePath}`);
    req.send();

    return req$;
  }
}
