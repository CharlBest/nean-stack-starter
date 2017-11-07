import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class CustomPreloading implements PreloadingStrategy {
    preload(route: Route, preload: Function): Observable<any> {
        return route.data && route.data.preload ? preload() : of(null);
    }
}
