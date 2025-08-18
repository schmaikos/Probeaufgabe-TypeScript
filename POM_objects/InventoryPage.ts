import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  page              : Page;
  inventoryContainer: Locator;
  inventoryItems    : Locator;
  cartIcon          : Locator;
  sortDropdown      : Locator;

  constructor(page: Page) {
    this.page               = page;
    this.inventoryContainer = page.locator(".inventory_list");
    this.inventoryItems     = page.locator(".inventory_item");
    this.cartIcon           = page.locator(".shopping_cart_link");
    this.sortDropdown       = page.locator(".product_sort_container");
  }

  async selectSortOption(option: string) {
    await this.sortDropdown.click();
    await this.sortDropdown.selectOption({ label: option });
  }

  async getSelectedSortOption() {
    return await this.sortDropdown.inputValue();
  }

  addToCartButton(itemName: string): Locator {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    return this.page.locator(`button[data-test="add-to-cart-${buttonName}"]`);
  }

  removeFromCartButton(itemName: string): Locator {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    return this.page.locator(`button[data-test="remove-${buttonName}"]`);
  }

  itemTitle       : string = ".inventory_item_name";
  itemDescription: string  = ".inventory_item_desc";
  itemPrice       : string = ".inventory_item_price";

  async isLoaded() {
    return await this.inventoryContainer.isVisible();
  }

  async getInventoryItems() {
    return await this.page.$$eval(this.itemTitle, (items) =>
      items.map((item) => item.textContent || ""),
    );
  }

  async addItemToCart(itemName: string) {
    await this.addToCartButton(itemName).click();
  }

  async removeItemFromCart(itemName: string) {
    await this.removeFromCartButton(itemName).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getItemImageLocator(itemName: string) {
  return this.page.locator(`img[alt='${itemName}']`);
  }

  async getItemPrice(itemName: string) {
    const itemLocator = await this.page.locator('.inventory_item').filter({ hasText: itemName });
    const priceLocator = await itemLocator.locator('.inventory_item_price');
    const price = await priceLocator.textContent();
    return price?.trim() || '';
  }
}

module.exports = { InventoryPage };
