
import { BrowserContext, Page } from 'puppeteer';
import { environment } from '../environments/environment.prod';
import { puppeteer } from '../test/global';

describe('App Component', () => {
    let browser: BrowserContext | null = null;
    let page: Page | null = null;

    beforeEach(async () => {
        browser = await puppeteer.createBrowserContext();
        page = await browser.newPage();
    });

    it('should be home title', async () => {
        if (page) {
            await page.goto(`${environment.serverEndpoint}`);

            const title = await page.title();
            expect(title).toEqual('Onboarding');
        }
    });

    afterEach(() => {
        if (browser) {
            browser.close();
        }
    });
});
