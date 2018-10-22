// https://github.com/ndelvalle/ng-giphy/blob/master/src/services/giphy.service.js
// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//     providedIn: 'root'
// })
// export class GiphyService {
//     // TODO: not yet in use
//     baseUrl = 'https://api.giphy.com/v1/gifs';
//     apiKey = '***';
//     url = {
//         random: `${this.baseUrl}/random`,
//         find: `${this.baseUrl}/search`,
//         findById: `${this.baseUrl}/%s`,
//         trending: `${this.baseUrl}/trending`,
//     };

//     constructor(private http: HttpClient) { }

//     private paramsMapper(tags?: any, limit?: string, offset?: string, rating?: string) {
//         const params = new Params();

//         if (tags) {
//             params.q = tags.constructor === Array ? tags.join('+') : tags;
//         }

//         if (limit) {
//             params.limit = limit;
//         }

//         if (offset) {
//             params.offset = offset;
//         }

//         if (rating) {
//             params.rating = rating;
//         }

//         return params;
//     }

//     private responseMapper(response, returnUrl, limit?) {
//         if (!returnUrl) {
//             return response;
//         }

//         const isArray = response.constructor === Array;
//         if (!isArray) {
//             return response.images.original.url;
//         }

//         return response.map(function (item) {
//             return item.images.original.url;
//         });
//     }

//     private get(url: string, data?): Observable<any> {
//         const params = data || {};
//         params.api_key = this.apiKey;
//         return this.http.get(url, { params: params })
//             .pipe(
//                 map((x: any) => {
//                     return x.data.data;
//                 })
//             );
//     }

//     find(tags, limit, offset, rating): Observable<any> {
//         return this.get(this.url.find, this.paramsMapper(tags, limit, offset, rating))
//             .pipe(
//                 map((x: any) => {
//                     return this.responseMapper(x, false, limit);
//                 })
//             );
//     }


//     findUrl(tags, limit, offset, rating): Observable<any> {
//         return this.get(this.url.find, this.paramsMapper(tags, limit, offset, rating))
//             .pipe(
//                 map((x: any) => {
//                     return this.responseMapper(x, true, limit);
//                 })
//             );
//     }

//     findById(id): Observable<any> {
//         return this.get(this.url.findById.replace('%s', id));
//     }

//     findUrlById(id): Observable<any> {
//         return this.get(this.url.findById.replace('%s', id))
//             .pipe(
//                 map((x: any) => {
//                     return this.responseMapper(x, true);
//                 })
//             );
//     }

//     findRandom(tags, rating): Observable<any> {
//         return this.get(this.url.random, this.paramsMapper(tags, rating));
//     }

//     findRandomUrl(tags, rating): Observable<any> {
//         return this.get(this.url.random, this.paramsMapper(tags, rating))
//             .pipe(
//                 map((x: any) => {
//                     return x.image_url;
//                 })
//             );
//     }

//     findTrending(limit, offset, rating): Observable<any> {
//         return this.get(this.url.trending, this.paramsMapper(undefined, limit, offset, rating))
//             .pipe(
//                 map((x: any) => {
//                     return this.responseMapper(x, false);
//                 })
//             );
//     }

//     findTrendingUrl(limit, offset, rating): Observable<any> {
//         return this.get(this.url.trending, this.paramsMapper(undefined, limit, offset, rating))
//             .pipe(
//                 map((x: any) => {
//                     return this.responseMapper(x, true);
//                 })
//             );
//     }
// }

// class Params {
//     q: Array<string>;
//     limit: string;
//     offset: string;
//     rating: string;
// }
