// tests/test_add_to_cart.spec.js

const { test, expect } = require('@playwright/test');
const config = require('../config');

test('Verify add to cart functionality', async ({ page }) => {
  await page.goto(config.BASE_URL);
  await page.fill('input[name="q"]', config.SEARCH_TERM);
  await page.press('input[name="q"]', 'Enter');
  await page.waitForSelector('.products-grid');

  const product = await page.$('.product-item');
  await product.click();

  await page.click('//div[@id=\'option-label-size-143-item-170\']');
  const sizeLabel = await page.locator('//div[@id=\'option-label-size-143-item-170\']').textContent();
  await page.click('//div[@id=\'option-label-color-93-item-57\']');
  const colorLabel = await page.locator('//div[@id=\'option-label-color-93-item-57\']').getAttribute('option-label');
  const qtyLabel = await page.locator('//input[@id=\'qty\']').getAttribute('value');
  await page.click('#product-addtocart-button');
  await page.waitForSelector('.message-success');

  const notification = await page.$('.message-success');
  expect(notification).not.toBeNull();

  await page.goto(config.BASE_URL + 'checkout/cart');

  const size = await page.locator('//dd[contains(text(),\'XL\')]').textContent();
  const color = await page.locator('//dd[contains(text(),\'Purple\')]').textContent();
  const quantity = await page.locator('//*[@data-role="cart-item-qty"]').getAttribute('value');
 
  expect(size).toContain(sizeLabel);
  expect(color).toContain(colorLabel);
  expect(quantity).toEqual(qtyLabel);

  const subtotal1 = await page.locator('//span[@data-bind="text: getValue(), attr: {\'data-th\': title}"]').textContent();

  await page.fill('//*[@data-role="cart-item-qty"]', '2');
  await page.click('//button[@title=\'Update Shopping Cart\']');
  await page.waitForLoadState('networkidle');

  const subtotal2 = await page.locator('//span[@data-bind="text: getValue(), attr: {\'data-th\': title}"]').textContent();
  expect(subtotal2).not.toEqual(subtotal1);
});
