import { Observable } from 'rxjs/Observable';
import { PreloadingStrategy, Route } from '@angular/router';
import 'rxjs/add/observable/of';

export class CustomPreloading implements PreloadingStrategy {
    preload(route: Route, preload: Function): Observable<any> {
        return route.data && route.data.preload ? preload() : Observable.of(null);
    }
}
