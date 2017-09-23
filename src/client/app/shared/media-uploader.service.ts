import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MediaUploaderService {

  constructor(private http: HttpClient) {
  }

  uploadFile(file: File, mediaType: any /*BolbMediaType*/) {
    const formDate = new FormData();
    formDate.append('', file);
    formDate.append('mediaType', mediaType.toString());

    // const headers = new Headers({
    //   'Content-Type': undefined,
    //   'Access-Control-Allow-Origin': '*'
    // });

    // const request = new Request({
    //   url: `${this.httpService.apiUrl}/api/media/uploadfile`,
    //   method: `post`,
    //   body: formDate
    // });
  }
}
