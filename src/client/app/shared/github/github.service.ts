import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  getFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.onload = () => {
        if (req.status === 200) {
          resolve(req.response as string);
        } else {
          reject(status.toString());
        }
      };

      req.open('GET', `https://raw.githubusercontent.com/CharlBest/nean-stack-starter/master/${filePath}`);
      req.send();
    });
  }
}
