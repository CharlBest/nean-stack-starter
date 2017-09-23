export class BaseRoute {

    constructor(public version: number, public rootRoute: string, public route: string) { }

    constructEndpointUrl(): string {
        return `/v${this.version}/${this.rootRoute}/${this.route}`;
    }

    constructRootUrl(): string {
        return `/api/v${this.version}/${this.rootRoute}/${this.route}`;
    }
}
