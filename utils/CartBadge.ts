import { Page, Locator } from '@playwright/test';

// Class for cart badge interactions
export class CartBadge {
  // Elements
  page     : Page;
  cartBadge: Locator;

  constructor(page: Page) {
    this.page      = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  // Get the count shown in cart badge
  async getCount() {
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = await this.cartBadge.textContent();
    return Number(text) || 0;
  }

  // Check if cart badge is visible
  async isVisible() {
    return await this.cartBadge.isVisible();
  }
}
