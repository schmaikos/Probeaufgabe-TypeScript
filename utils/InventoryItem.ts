import { Page, Locator } from '@playwright/test';

// Class for inventory item interactions
export class InventoryItem {
  // Elements
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

  // Add item to shopping cart
  async addToCart() {
    await this.addToCartButton.click();
  }

  // Remove item from cart
  async removeFromCart() {
    await this.removeButton.click();
  }

  // Navigate back to products page
  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
