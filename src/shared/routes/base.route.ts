import { environment } from '../../client/environments/environment';

export class BaseRoute {
    constructor(public rootRoute: string, public route: string,
        public params?: { [key: string]: QueryParam }, public version = 1) { }

    server(): string {
        return `/v${this.version}/${this.rootRoute}/${this.route}${this.serverUrlParams()}`;
    }

    client(queryParams?: { [key: string]: QueryParam }): string {
        let url = `${environment.serverEndpoint}/api/v${this.version}/${this.rootRoute}/${this.route}`;

        // Url params
        url = this.clientUrlParams(url);

        // Query params
        url = this.clientQueryParams(url, queryParams);

        return url;
    }

    private serverUrlParams(): string {
        if (this.params) {
            return `/:${Object.keys(this.params).join('/:')}`;
        } else {
            return '';
        }
    }

    private clientUrlParams(url: string): string {
        if (this.params) {
            for (const key in this.params) {
                if (this.params.hasOwnProperty(key)) {
                    url = `${url}/${this.params[key]}`;
                }
            }
        }

        return url;
    }

    private clientQueryParams(url: string, queryParams?: { [key: string]: QueryParam }): string {
        if (queryParams) {
            let isFirstQueryParam = true;
            for (const key in queryParams) {
                if (queryParams.hasOwnProperty(key) && queryParams[key] !== undefined && queryParams[key] !== null) {
                    url = `${url}${isFirstQueryParam ? '?' : '&'}${key}=${queryParams[key]}`;
                    isFirstQueryParam = false;
                }
            }
        }

        return url;
    }
}

type QueryParam = string | number | boolean | undefined | null;
