import { Page, Locator } from "@playwright/test";

export class CheckoutCompletePage {
  page          : Page;
  completeHeader: Locator;
  completeText  : Locator;
  backHomeButton: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.completeHeader = page.locator(".complete-header");
    this.completeText   = page.locator(".complete-text");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }


  async isLoaded() {
    return await this.completeHeader.isVisible();
  }

  async getCompleteHeader() {
    return await this.completeHeader.textContent();
  }

  async getCompleteText() {
    return await this.completeText.textContent();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }
}

module.exports = { CheckoutCompletePage };
