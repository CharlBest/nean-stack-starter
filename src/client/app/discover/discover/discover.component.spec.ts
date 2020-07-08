
import { BrowserContext, Page } from 'puppeteer';
import { environment } from '../../../environments/environment.prod';
import { puppeteer } from '../../../test/global';

describe('Search Component', () => {
    let browser: BrowserContext | null = null;
    let page: Page | null = null;

    beforeEach(async () => {
        browser = await puppeteer.createBrowserContext();
        page = await browser.newPage();
    });

    it('should be search title', async () => {
        if (page) {
            await page.goto(`${environment.serverEndpoint}/discover`);

            const title = await page.title();
            expect(title).toEqual('Search');

            // TODO screenshot
            // await puppeteer.screenshot(page, `${await page.title()}-1`);
        }
    });

    it('should be able to search', async () => {
        if (page) {
            await page.goto(`${environment.serverEndpoint}/discover`);

            await page.type('header input', 'test');
            const element = await page.$('header input');
            if (element) {
                await element.press('Enter');
            }
        }
    });

    afterEach(async () => {
        if (browser) {
            browser.close();
        }
    });
});
