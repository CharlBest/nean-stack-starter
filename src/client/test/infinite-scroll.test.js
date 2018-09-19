// @ts-check
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'http://scrollmagic.io/examples/advanced/infinite_scrolling.html';
    let elementsFound = 0;

    await page.goto(url);

    while (elementsFound < 30) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        // const screen = await page.screenshot({ path: `${url.replace('http://', '').replace('/', '').replace('.', '')}.png` });
        await page.waitFor(1000);
        elementsFound = (await page.$$('.box1')).length;
        console.log(elementsFound);
    }

    await browser.close();
})();