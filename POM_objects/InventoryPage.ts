import { Page, Locator } from "@playwright/test";

// Page Object for inventory/products page
export class InventoryPage {
  // Selectors
  itemTitle: string       = ".inventory_item_name";
  itemPrice: string       = ".inventory_item_price";

  // Elements
  page              : Page;
  inventoryContainer: Locator;
  cartIcon          : Locator;
  sortDropdown      : Locator;

  constructor(page: Page) {
    this.page               = page;
    this.inventoryContainer = page.locator(".inventory_list");
    this.cartIcon           = page.locator(".shopping_cart_link");
    this.sortDropdown       = page.locator(".product_sort_container");
  }

  // Check if inventory page is loaded
  async isLoaded() {
    return await this.inventoryContainer.isVisible();
  }

  // Select sorting option
  async selectSortOption(option: string) {
    await this.sortDropdown.click();
    await this.sortDropdown.selectOption(option);
  }

  // Get currently selected sort option
  async getSelectedSortOption() {
    return await this.sortDropdown.inputValue();
  }

  // Get list of all inventory item names
  async getInventoryItems() {
    return await this.page.$$eval(this.itemTitle, (items) =>
      items.map((item) => item.textContent || ""),
    );
  }

  async addItemToCart(itemName: string) {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    await this.page.locator(`button[data-test="add-to-cart-${buttonName}"]`).click();
  }

  // Remove item from cart
  async removeItemFromCart(itemName: string) {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    await this.page.locator(`button[data-test="remove-${buttonName}"]`).click();
  }

  // Navigate to cart page
  async goToCart() {
    await this.cartIcon.click();
  }

  // Get item image locator for clicking
  async getItemImageLocator(itemName: string) {
    return await this.page.locator(`img[alt='${itemName}']`);
  }

  // Get price of item
  async getItemPrice(itemName: string) {
    const itemLocator  = this.page.locator('.inventory_item').filter({ hasText: itemName });
    const priceLocator = itemLocator.locator(this.itemPrice);
    const price        = await priceLocator.textContent();
    return price?.trim() || '';
  }

  // Check if item is currently in cart
  async isItemInCart(itemName: string) {
    const buttonName   = itemName.toLowerCase().replace(/ /g, "-");
    const removeButton = this.page.locator(`button[data-test="remove-${buttonName}"]`);
    return await removeButton.isVisible();
  }

  // Click item name to go to detail page
  async clickItemName(itemName: string) {
    const itemLocator = this.page.locator('.inventory_item').filter({ hasText: itemName });
    const nameLink    = itemLocator.locator(this.itemTitle);
    await nameLink.click();
  }

  // Click item image to go to detail page
  async clickItemImage(itemName: string) {
    const imageLocator = this.page.locator(`img[alt='${itemName}']`);
    await imageLocator.click();
  }
}
