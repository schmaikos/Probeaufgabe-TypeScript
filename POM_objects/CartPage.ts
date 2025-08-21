import { Page, Locator } from "@playwright/test";

// Page Object for shopping cart functionality
export class CartPage {
  // Selectors
  itemTitle: string = ".inventory_item_name";
  itemPrice: string = ".inventory_item_price";

  // Elements
  page                  : Page;
  cartList              : Locator;
  checkoutButton        : Locator;
  continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page                   = page;
    this.cartList               = page.locator(".cart_list");
    this.checkoutButton         = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // Check if cart page is loaded
  async isLoaded() {
    return await this.cartList.isVisible();
  }

  // Get list of items in cart
  async getCartItems() {
    return await this.page.$$eval(this.itemTitle, (items) =>
      items.map((item) => item.textContent || ""),
    );
  }

  // Remove item from cart by name
  async removeItem(itemName: string) {
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    await this.page.locator(`button[data-test="remove-${buttonName}"]`).click();
  }

  // Navigate to checkout
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // Return to inventory page
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // Get price of specific item
  async getItemPrice(itemName: string) {
    const itemLocator  = await this.page.locator('.cart_item').filter({ hasText: itemName });
    const priceLocator = await itemLocator.locator(this.itemPrice);
    const price        = await priceLocator.textContent();
    return price?.trim() || '';
  }
}
