export class BaseRoute {

    constructor(public version: number, public rootRoute: string, public route: string) { }

    constructEndpointUrl(append: string = ''): string {
        return `/v${this.version}/${this.rootRoute}/${this.route}${append}`;
    }

    constructRootUrl(append: string = ''): string {
        return `/api/v${this.version}/${this.rootRoute}/${this.route}${append}`;
    }
}
