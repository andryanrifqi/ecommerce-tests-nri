// tests/test_search.spec.js

const { test, expect } = require('@playwright/test');
const config = require('../config');

test('Verify search box functionality', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');
  const products = await page.$$eval('//div[@class=\'products wrapper grid products-grid\']//div/strong/a', 
    elements => elements.map(el => el.textContent));

  for (const product of products) {
    expect(product).toContain(config.SEARCH_TERM);
  }
});
