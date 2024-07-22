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
  const colorLabel = await page.locator('//div[@id=\'option-label-color-93-item-57\']').textContent();
  await page.click('#product-addtocart-button');
  await page.waitForSelector('.message-success');

  const notification = await page.$('.message-success');
  expect(notification).not.toBeNull();

  await page.goto(config.BASE_URL + 'checkout/cart');
  const cartItem = await page.$('.cart-item');

  const size = await page.locator('//dd[contains(text(),\'XL\')]').textContent();
  const color = await page.locator('//dd[contains(text(),\'Purple\')]').textContent();
  const quantity = await page.locator('//input[@id=\'cart-205907-qty\']').getAttribute('value');
  console.log(quantity);
  
  expect(size).toEqual(sizeLabel)
  expect(color).toEqual(colorLabel)
  expect(quantity).toBe('1');

  await cartItem.fill('.input-text.qty', '2');
  await page.click('button.update-cart-item');
  await page.waitForLoadState('networkidle');

  const subtotal = await cartItem.$eval('.subtotal .price', el => parseFloat(el.textContent.replace('$', '')));
  expect(subtotal).toBeGreaterThan(0);
});
