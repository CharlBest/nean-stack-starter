export class BaseRoute {
    constructor(public rootRoute: string, public route: string,
        public params?: { [key: string]: string | number | undefined }, public version = 1) { }

    server(): string {
        return `/v${this.version}/${this.rootRoute}/${this.route}${this.params ? `/:${Object.keys(this.params).join('/:')}` : ''}`;
    }

    client(queryParams?: { [key: string]: string | number }): string {
        let url = `/api/v${this.version}/${this.rootRoute}/${this.route}`;

        // Params
        if (this.params) {
            for (const key in this.params) {
                if (this.params.hasOwnProperty(key)) {
                    url = `${url}/${this.params[key]}`;
                }
            }
        }

        // Query params
        if (queryParams) {
            let isFirstQueryParam = true;
            for (const key in queryParams) {
                if (queryParams.hasOwnProperty(key)) {
                    if (queryParams[key] !== undefined && queryParams[key] !== null) {
                        url = `${url}${isFirstQueryParam ? '?' : '&'}${key}=${queryParams[key]}`;
                        isFirstQueryParam = false;
                    }
                }
            }
        }

        return url;
    }
}
