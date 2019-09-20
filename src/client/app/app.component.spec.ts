
import { BrowserContext, Page } from 'puppeteer';
import { environment } from '../environments/environment.prod';
import { puppeteer } from '../test/global';

describe('App Component', () => {
    let browser: BrowserContext | any = null;
    let page: Page | any = null;

    beforeEach(async () => {
        browser = await puppeteer.createBrowserContext();
        page = await browser.newPage();
    });

    it('should be home title', async () => {
        await page.goto(`${environment.serverEndpoint}`);

        const title = await page.title();
        expect(title).toEqual('Onboarding');
    });

    afterEach(() => {
        browser.close();
    });
});
