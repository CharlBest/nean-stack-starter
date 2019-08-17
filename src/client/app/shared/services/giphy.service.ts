// https://github.com/ndelvalle/ng-giphy/blob/master/src/services/giphy.service.js
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GiphyService {
    // TODO: not yet in use
    baseUrl = 'https://api.giphy.com/v1/gifs';
    apiKey = '***';
    url = {
        random: `${this.baseUrl}/random`,
        find: `${this.baseUrl}/search`,
        findById: `${this.baseUrl}/%s`,
        trending: `${this.baseUrl}/trending`,
    };

    constructor(private http: HttpClient) { }

    find(tags: any, limit: any, offset: any, rating: any): Promise<any> {
        return this.get(this.url.find, this.paramsMapper(tags, limit, offset, rating))
            .pipe(
                map((x: any) => {
                    return this.responseMapper(x, false);
                })
            ).toPromise();
    }


    findUrl(tags: any, limit: any, offset: any, rating: any): Promise<any> {
        return this.get(this.url.find, this.paramsMapper(tags, limit, offset, rating))
            .pipe(
                map((x: any) => {
                    return this.responseMapper(x, true);
                })
            ).toPromise();
    }

    findById(id: any): Promise<any> {
        return this.get(this.url.findById.replace('%s', id)).toPromise();
    }

    findUrlById(id: any): Promise<any> {
        return this.get(this.url.findById.replace('%s', id))
            .pipe(
                map((x: any) => {
                    return this.responseMapper(x, true);
                })
            ).toPromise();
    }

    findRandom(tags: any, rating: any): Promise<any> {
        return this.get(this.url.random, this.paramsMapper(tags, rating)).toPromise();
    }

    findRandomUrl(tags: any, rating: any): Promise<any> {
        return this.get(this.url.random, this.paramsMapper(tags, rating))
            .pipe(
                map((x: any) => {
                    return x.image_url;
                })
            ).toPromise();
    }

    findTrending(limit: any, offset: any, rating: any): Promise<any> {
        return this.get(this.url.trending, this.paramsMapper(undefined, limit, offset, rating))
            .pipe(
                map((x: any) => {
                    return this.responseMapper(x, false);
                })
            ).toPromise();
    }

    findTrendingUrl(limit: any, offset: any, rating: any): Promise<any> {
        return this.get(this.url.trending, this.paramsMapper(undefined, limit, offset, rating))
            .pipe(
                map((x: any) => {
                    return this.responseMapper(x, true);
                })
            ).toPromise();
    }

    private paramsMapper(tags?: any, limit?: string, offset?: string, rating?: string) {
        const params = new Params();

        if (tags) {
            params.q = tags.constructor === Array ? tags.join('+') : tags;
        }

        if (limit) {
            params.limit = limit;
        }

        if (offset) {
            params.offset = offset;
        }

        if (rating) {
            params.rating = rating;
        }

        return params;
    }

    private responseMapper(response: any, returnUrl: any) {
        if (!returnUrl) {
            return response;
        }

        const isArray = response.constructor === Array;
        if (!isArray) {
            return response.images.original.url;
        }

        return response.map((item: any) => {
            return item.images.original.url;
        });
    }

    private get(url: string, data?: any): Observable<any> {
        const params = data || {};
        params.api_key = this.apiKey;
        return this.http.get(url, { params })
            .pipe(
                map((x: any) => {
                    return x.data.data;
                })
            );
    }
}

class Params {
    q: Array<string>;
    limit: string;
    offset: string;
    rating: string;
}
