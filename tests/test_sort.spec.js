// tests/test_sort.spec.js

const { test, expect } = require('@playwright/test');
const config = require('../config');

test('Verify sort by price high to low', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');

  await page.selectOption('select#sorter', { label: config.SORT_BY_PRICE_HIGH });
  await page.waitForLoadState('networkidle');

  const prices = await page.$$eval('.price', elements => elements.map(el => parseFloat(el.textContent.replace('$', ''))));
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('Verify sort by price low to high', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');

  await page.selectOption('select#sorter', { label: config.SORT_BY_PRICE_LOW });
  await page.waitForLoadState('networkidle');

  const prices = await page.$$eval('.price', elements => elements.map(el => parseFloat(el.textContent.replace('$', ''))));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});
