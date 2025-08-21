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
  paymentInfo     : Locator;
  shippingInfo    : Locator;
  cartItems       : Locator;

  constructor(page: Page) {
    this.page             = page;
    this.summaryContainer = page.locator(".checkout_summary_container");
    this.finishButton     = page.locator('[data-test="finish"]');
    this.cancelButton     = page.locator('[data-test="cancel"]');
    this.itemTotal        = page.locator(".summary_subtotal_label");
    this.tax              = page.locator(".summary_tax_label");
    this.total            = page.locator(".summary_total_label");
    this.paymentInfo      = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo     = page.locator('[data-test="shipping-info-value"]');
    this.cartItems        = page.locator('.cart_item');
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

  // Get payment information
  async getPaymentInformation() {
    return await this.paymentInfo.textContent();
  }

  // Get shipping information
  async getShippingInformation() {
    return await this.shippingInfo.textContent();
  }

  // Get cart items in checkout summary
  async getCheckoutItems() {
    const items = await this.cartItems.allTextContents();
    return items;
  }
}
