import { Page, Locator } from '@playwright/test';

export class InventoryItem {
  page                : Page;
  addToCartButton     : Locator;
  removeButton        : Locator;
  backToProductsButton: Locator;

  constructor(page: Page) {
    this.page                 = page;
    this.addToCartButton      = page.locator('[data-test^="add-to-cart-"]');
    this.removeButton         = page.locator('[data-test^="remove-"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }
}

module.exports = { InventoryItem };
