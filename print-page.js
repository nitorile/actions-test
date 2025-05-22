import playwright from 'playwright';
import fs from 'fs/promises';

async function getPlatforms() {
  return JSON.parse(await fs.readFile('platforms.json', 'utf8'));
}

async function printPageImage(url, userAgent) {
  if (!userAgent) {
    userAgent = (await getPlatforms())[0].userAgent;
  }

  const options = {
    channel: 'chromium',
  }

  if (process.env.CGSS_INFO_PROXY) {
    options.proxy = {server: process.env.CGSS_INFO_PROXY};
  }

  const browser = await playwright.chromium.launch(options);

  const page = await browser.newPage({userAgent, screen: {width: 888, height: 444}});
  await page.setViewportSize({width: 888, height: 444});
  await page.goto(url);

  //set font
  await page.locator('body').evaluate(element => element.style['font-family'] = '"Noto Sans CJK JP", sans-serif;');

  const image = await page.screenshot({fullPage: true});

  await browser.close();
  return image;
}

export {printPageImage};
