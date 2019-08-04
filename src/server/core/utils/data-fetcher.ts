
import { Application } from 'express';
import { v4 as nodeUUId } from 'uuid';
import { itemsRepository } from '../../app/items/items.repository';
import { Database } from '../database';

class DataFetcher {
    // dom element selectors
    selectors = {
        LENGTH_SELECTOR_CLASS: '#sr_content div.box',
        LIST_TITLE_SELECTOR: '#sr_content div.box:nth-child(INDEX) > .search_result_title_box > h2 > a',
        LIST_DESCRIPTION_SELECTOR: '#sr_content div.box:nth-child(INDEX) > .text-block > p',
        LIST_IMAGE_SELECTOR: '#sr_content div.box:nth-child(INDEX) > .image > a > img',
    };

    interval: any;
    app: Application;

    constructor() { }

    init(app: Application) {
        // Use this to test site via puppeteer
        // import * as puppeteer from 'puppeteer';
        // setTimeout(() => this.app = app, 1000);
        // this.interval = setTimeout(() => this.execution(), 0);
    }

    async execution() {
        // TODO: Check null and undefined thouroughout especially with query selectors

        // TODO: Remove window in front of puppeteer
        const browser = await (window as any).puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true
        });
        const page = await browser.newPage();

        await page.goto('https://www.daft.ie/dublin/residential-property-for-rent/?searchSource=rental');
        await page.waitFor(2 * 1000);

        const listLength = await page.evaluate((sel: string) => {
            return document.querySelectorAll(sel).length;
        }, this.selectors.LENGTH_SELECTOR_CLASS);

        for (let i = 1; i <= listLength; i++) {
            // change the index to the next child
            const titleSelector = this.selectors.LIST_TITLE_SELECTOR.replace('INDEX', i.toString());
            const descriptionSelector = this.selectors.LIST_DESCRIPTION_SELECTOR.replace('INDEX', i.toString());
            const imageSelector = this.selectors.LIST_IMAGE_SELECTOR.replace('INDEX', i.toString());

            // Title
            const title = await page.evaluate((sel: string) => {
                const element = document.querySelector(sel) as HTMLAnchorElement;
                return element ? element.textContent : null;

            }, titleSelector);

            // Description
            const description = await page.evaluate((sel: string) => {
                const element = document.querySelector(sel) as HTMLParagraphElement;
                return element ? element.textContent : null;
            }, descriptionSelector);

            // Image
            await page.evaluate((sel: string) => {
                const element = document.querySelector(sel) as HTMLImageElement;
                return element ? element.src : null;
            }, imageSelector);

            if (title && description) {
                const neo4jSession = Database.createSession();
                await itemsRepository.createItemFromDataFetcher(neo4jSession, this.app, 1, nodeUUId(), title, description, null);
                neo4jSession.close();
            }
        }

        await browser.close();

        // Recursion loop for execution
        this.clearInterval();
        this.interval = setTimeout(() => this.execution(), this.msToNextHour());
    }

    msToNextHour(): number {
        return 3600000 - new Date().getTime() % 3600000;
    }

    clearInterval() {
        clearInterval(this.interval);
    }
}

export const dataFetcher = new DataFetcher();
