import { Page, Locator } from "@playwright/test";

// Page Object for checkout step 2
export class CheckoutStepTwoPage {
  // Elements
  page            : Page;
  summaryContainer: Locator;
  finishButton    : Locator;
  cancelButton    : Locator;
  itemTotal       : Locator;
  tax             : Locator;
  total           : Locator;

  constructor(page: Page) {
    this.page             = page;
    this.summaryContainer = page.locator(".checkout_summary_container");
    this.finishButton     = page.locator('[data-test="finish"]');
    this.cancelButton     = page.locator('[data-test="cancel"]');
    this.itemTotal        = page.locator(".summary_subtotal_label");
    this.tax              = page.locator(".summary_tax_label");
    this.total            = page.locator(".summary_total_label");
  }

  // Check if checkout summary page is loaded
  async isLoaded() {
    return await this.summaryContainer.isVisible();
  }

  // Complete the order
  async finishCheckout() {
    await this.finishButton.click();
  }

  // Cancel checkout and return to cart
  async cancelCheckout() {
    await this.cancelButton.click();
  }

  // Get subtotal amount
  async getItemTotal() {
    return await this.itemTotal.textContent();
  }

  // Get tax amount
  async getTax() {
    return await this.tax.textContent();
  }

  // Get total amount
  async getTotal() {
    return await this.total.textContent();
  }
}
