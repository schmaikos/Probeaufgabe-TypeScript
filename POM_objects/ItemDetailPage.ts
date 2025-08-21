import { Page, Locator } from "@playwright/test";

// Page Object for product detail page
export class ItemDetailPage {
  // Elements
  page                : Page;
  backToProductsButton: Locator;
  itemName            : Locator;
  itemDescription     : Locator;
  itemPrice           : Locator;
  addToCartButton     : Locator;
  removeFromCartButton: Locator;

  constructor(page: Page) {
    this.page                 = page;
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.itemName             = page.locator('.inventory_details_name');
    this.itemDescription      = page.locator('.inventory_details_desc');
    this.itemPrice            = page.locator('.inventory_details_price');
    this.addToCartButton      = page.locator('.btn_primary.btn_inventory');
    this.removeFromCartButton = page.locator('.btn_secondary.btn_inventory');
  }

  // Check if item detail page is loaded
  async isLoaded() {
    return await this.itemName.isVisible();
  }

  // Get item name
  async getItemName() {
    return await this.itemName.textContent();
  }

  // Get item description
  async getItemDescription() {
    return await this.itemDescription.textContent();
  }

  // Get item price
  async getItemPrice() {
    return await this.itemPrice.textContent();
  }

  // Check if add to cart button is visible
  async isAddToCartButtonVisible() {
    return await this.addToCartButton.isVisible();
  }

  // Check if remove from cart button is visible
  async isRemoveFromCartButtonVisible() {
    return await this.removeFromCartButton.isVisible();
  }

  // Add item to cart
  async addItemToCart() {
    await this.addToCartButton.click();
  }

  // Remove item from cart
  async removeItemFromCart() {
    await this.removeFromCartButton.click();
  }

  // Navigate back to products page
  async backToProducts() {
    await this.backToProductsButton.click();
  }
}
