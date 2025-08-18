import { Page, Locator } from "@playwright/test";

export class CartPage {
  page          : Page;
  cartList      : Locator;
  cartItems     : Locator;
  checkoutButton: Locator;
  continueShoppingButton: Locator;

  constructor(page: Page) {
  this.page           = page;
  this.cartList       = page.locator(".cart_list");
  this.cartItems      = page.locator(".cart_item");
  this.checkoutButton = page.locator('[data-test="checkout"]');
  this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  removeButton(itemName: string): Locator {
    return this.page.locator(`button[data-test="remove-${itemName}"]`);
  }

  itemTitle      : string = ".inventory_item_name";

  // Actions
  async isLoaded() {
    return await this.cartList.isVisible();
  }

  async getCartItems() {
    return await this.page.$$eval(this.itemTitle, (items) =>
      items.map((item) => item.textContent || ""),
    );
  }

  removeFromCartButton(itemName: string): Locator {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    return this.page.locator(`button[data-test="remove-${buttonName}"]`);
  }

  async removeItem(itemName: string) {
    await this.removeFromCartButton(itemName).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CartPage };
