// tests/test_sort.spec.js

const { test, expect } = require('@playwright/test');
const config = require('../config');

test('Verify sort by price high to low', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');

  await page.selectOption('select#sorter', 'Price');
  await page.waitForLoadState('networkidle');

  const sortState = await page.locator('(//a[@title=\'Set Ascending Direction\'])[1]').getAttribute('data-value');
  if (sortState != 'asc'){
    await page.click('(//a[@title=\'Set Descending Direction\'])[1]')
  }

  const prices = await page.$$eval('(//div[@class=\'price-box price-final_price\'])//span[@class="price"]', elements => elements.map(el => parseFloat(el.textContent.replace('$', ''))));
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('Verify sort by price low to high', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');

  await page.selectOption('select#sorter', 'Price');
  await page.waitForLoadState('networkidle');

  const sortState = await page.locator('(//a[@title=\'Set Ascending Direction\'])[1]').getAttribute('data-value');
  if (sortState != 'desc'){
    await page.click('(//a[@title=\'Set Ascending Direction\'])[1]')
  }

  const prices = await page.$$eval('(//div[@class=\'price-box price-final_price\'])//span[@class="price"]', elements => elements.map(el => parseFloat(el.textContent.replace('$', ''))));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});
