
import * as express from 'express';
import { ItemsRepository } from '../../app/items/items.repository';

export class DataFetcher {
    // dom element selectors
    selectors = {
        LENGTH_SELECTOR_CLASS: '#sr_content div.box',
        LIST_TITLE_SELECTOR: '#sr_content div.box:nth-child(INDEX) > .search_result_title_box > h2 > a',
        LIST_DESCRIPTION_SELECTOR: '#sr_content div.box:nth-child(INDEX) > .text-block > p',
    };

    private itemsRepository: ItemsRepository;
    interval: any;
    app: express.Application;

    constructor() {
        this.itemsRepository = new ItemsRepository();
    }

    init(app: express.Application) {
        setTimeout(() => this.app = app, 1000);
        this.interval = setTimeout(() => this.execution(), 0);
    }

    async execution() {
        // TODO: Check null and undefined thouroughout especially with query selectors

        // const browser = await puppeteer.launch({
        //     args: ['--no-sandbox'],
        //     headless: true
        // });
        // const page = await browser.newPage();

        // await page.goto('https://www.daft.ie/dublin/residential-property-for-rent/?searchSource=rental');
        // await page.waitFor(2 * 1000);

        // const listLength = await page.evaluate((sel) => {
        //     return document.querySelectorAll(sel).length;
        // }, this.selectors.LENGTH_SELECTOR_CLASS);

        // let neo4jSession;

        // for (let i = 1; i <= listLength; i++) {
        //     // change the index to the next child
        //     const titleSelector = this.selectors.LIST_TITLE_SELECTOR.replace('INDEX', i.toString());
        //     const descriptionSelector = this.selectors.LIST_DESCRIPTION_SELECTOR.replace('INDEX', i.toString());

        //     const title = await page.evaluate((sel) => {
        //         const element = (<HTMLAnchorElement>document.querySelector(sel));
        //         return element ? element.textContent : null;

        //     }, titleSelector);

        //     const description = await page.evaluate((sel) => {
        //         const element = (<HTMLParagraphElement>document.querySelector(sel));
        //         return element ? element.textContent : null;
        //     }, descriptionSelector);

        //     if (title && description) {
        //         neo4jSession = Database.createSession();
        //         await this.itemsRepository.createInternal(neo4jSession, this.app.locals.dbQueries.items.create, 1, nodeUUId(), title, description);
        //     }
        // }

        // if (neo4jSession) {
        //     neo4jSession.close();
        // }

        // // Recursion loop for execution
        // this.clearInterval();
        // this.interval = setTimeout(() => this.execution(), this.msToNextHour());
    }

    msToNextHour(): number {
        return 3600000 - new Date().getTime() % 3600000;
    }

    clearInterval() {
        clearInterval(this.interval);
    }

    async hallo() {
        console.log('hit');
    }
}
