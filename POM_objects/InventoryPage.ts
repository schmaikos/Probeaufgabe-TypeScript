import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  private itemTitle: string       = ".inventory_item_name";
  private itemDescription: string = ".inventory_item_desc";
  private itemPrice: string       = ".inventory_item_price";

  private page              : Page;
  private inventoryContainer: Locator;
  private inventoryItems    : Locator;
  private cartIcon          : Locator;
  private sortDropdown      : Locator;

  constructor(page: Page) {
    this.page               = page;
    this.inventoryContainer = page.locator(".inventory_list");
    this.inventoryItems     = page.locator(".inventory_item");
    this.cartIcon           = page.locator(".shopping_cart_link");
    this.sortDropdown       = page.locator('[data-test="product_sort_container"]');
  }

  async isLoaded() {
    return await this.inventoryContainer.isVisible();
  }

  async selectSortOption(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getSelectedSortOption() {
    return await this.sortDropdown.inputValue();
  }

  async getInventoryItems() {
    return await this.page.$$eval(this.itemTitle, (items) =>
      items.map((item) => item.textContent || ""),
    );
  }

  async addItemToCart(itemName: string){
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    await this.page.locator(`button[data-test="add-to-cart-${buttonName}"]`).click();
  }

  async removeItemFromCart(itemName: string) {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    await this.page.locator(`button[data-test="remove-${buttonName}"]`).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getItemImageLocator(itemName: string){
    return await this.page.locator(`img[alt='${itemName}']`);
  }

  async getItemPrice(itemName: string){
    const itemLocator  = this.page.locator('.inventory_item').filter({ hasText: itemName });
    const priceLocator = itemLocator.locator(this.itemPrice);
    const price        = await priceLocator.textContent();
    return price?.trim() || '';
  }
}
