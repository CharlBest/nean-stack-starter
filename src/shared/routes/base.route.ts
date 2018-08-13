export class BaseRoute {
    constructor(public rootRoute: string, public route: string, public params?: { [key: string]: any }, public version = 1) { }

    server(): string {
        return `/v${this.version}/${this.rootRoute}/${this.route}${this.params ? `/:${Object.keys(this.params).join('/:')}` : ''}`;
    }

    client(): string {
        let url = `/api/v${this.version}/${this.rootRoute}/${this.route}`;
        if (this.params) {
            for (const key in this.params) {
                if (this.params.hasOwnProperty(key)) {
                    url = `${url}/${this.params[key]}`;
                }
            }
        }
        return url;
    }
}
