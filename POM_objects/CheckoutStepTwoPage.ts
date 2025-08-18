import { Page, Locator } from "@playwright/test";

export class CheckoutStepTwoPage {
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


  async isLoaded() {
    return await this.summaryContainer.isVisible();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async getItemTotal() {
    return await this.itemTotal.textContent();
  }

  async getTax() {
    return await this.tax.textContent();
  }

  async getTotal() {
    return await this.total.textContent();
  }
}

module.exports = { CheckoutStepTwoPage };
