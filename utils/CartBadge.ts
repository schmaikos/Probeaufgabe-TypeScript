import { Page, Locator } from '@playwright/test';

export class CartBadge {
  page: Page;
  cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async getCount() {
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = await this.cartBadge.textContent();
    return Number(text) || 0;
  }

  async isVisible() {
    return await this.cartBadge.isVisible();
  }
}

module.exports = { CartBadge };
