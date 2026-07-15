const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  const outDir = __dirname;

  await page.screenshot({
    path: path.join(outDir, 'screenshot_home.png'),
    fullPage: true,
  });
  console.log('screenshot_home.png saved');

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(outDir, 'screenshot_composer.png'),
  });
  console.log('screenshot_composer.png saved');

  await browser.close();
  console.log('DONE');
})();
