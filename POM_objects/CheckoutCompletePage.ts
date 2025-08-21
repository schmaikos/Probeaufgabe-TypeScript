import { Page, Locator } from "@playwright/test";

// Page Object for order completion page
export class CheckoutCompletePage {
  // Elements
  page          : Page;
  title         : Locator;
  completeHeader: Locator;
  completeText  : Locator;
  backHomeButton: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.title          = page.locator(".title");
    this.completeHeader = page.locator(".complete-header");
    this.completeText   = page.locator(".complete-text");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Check if order completion page is loaded
  async isLoaded() {
    return await this.completeHeader.isVisible();
  }

  // Get page title
  async getTitle() {
    return await this.title.textContent();
  }

  // Get header text
  async getCompleteHeader() {
    return await this.completeHeader.textContent();
  }

  // Get message text
  async getCompleteText() {
    return await this.completeText.textContent();
  }

  // Return to inventory page
  async backToProducts() {
    await this.backHomeButton.click();
  }
}
