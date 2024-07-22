// tests/test_search.spec.js

const { test, expect } = require('@playwright/test');
const config = require('../config');

test('Verify search box functionality', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');
  const productTitles = await page.$$eval('.product-item-name a', elements => elements.map(el => el.textContent));

  for (const title of productTitles) {
    expect(title.toLowerCase()).toContain(config.SEARCH_TERM.toLowerCase());
  }
});
