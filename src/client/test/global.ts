import { Browser, BrowserContext, devices, launch, Page } from 'puppeteer';

// Visual Regression Testing tool: https://github.com/reg-viz/reg-suit
// User waitForSelector, waitForResponse, waitForNavigation
// Request & response interceptors
// page.tracing.start(), page.coverage.startCSSCoverage(), page.coverage.startJSCoverage()
// Tips https://www.youtube.com/watch?v=PQScm-sA2EM

class PuppeteerInstance {
    private browser: Promise<Browser>;

    constructor() {
        this.browser = launch({
            // headless: false,
            // slowMo: 80,
            // args: [`--window-size=${width},${height}`]
        });
    }

    // Remember to close browser context
    async createBrowserContext(): Promise<BrowserContext> {
        const browser = await this.browser;
        return browser.createIncognitoBrowserContext();
    }

    async emulate(page: Page, device: 'iPhone 8' | 'iPhone 9'): Promise<void> {
        await page.emulate(devices[device]);
    }

    async screenshot(page: Page, path: string): Promise<void> {
        await page.screenshot({ path: `src/client/regression-images/${path}.png`, fullPage: true });
    }

    async offline(page: Page, offline: boolean = true): Promise<void> {
        await page.setOfflineMode(offline);
    }

    async checkIfServiceWorkerIsRegistered(context: BrowserContext): Promise<boolean> {
        const swTarget = await context.waitForTarget(target => {
            return target.type() === 'service_worker';
        });
        return !!swTarget;
    }

    async setGeolocation(context: BrowserContext, latitude: number, longitude: number): Promise<Page> {
        await context.overridePermissions('https://example.com', ['geolocation']);
        const page = await context.newPage();
        await page.setGeolocation({
            latitude,
            longitude
        });
        return page;
    }

    async showPageMetrics(page: Page): Promise<void> {
        const metrics = await page.metrics();
        console.log(metrics);
        console.log('JS Heap User Size', metrics.JSHeapUsedSize);
    }

    async accessibilitySnapshot(page: Page): Promise<void> {
        const snapshot = await page.accessibility.snapshot();
        console.log(snapshot);
    }


}
export const puppeteer = new PuppeteerInstance();
