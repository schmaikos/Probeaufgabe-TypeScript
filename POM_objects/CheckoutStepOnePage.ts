import { Page, Locator } from "@playwright/test";

// Page Object for checkout step 1
export class CheckoutStepOnePage {
  // Elements
  page           : Page;
  firstNameInput : Locator;
  lastNameInput  : Locator;
  postalCodeInput: Locator;
  continueButton : Locator;
  cancelButton   : Locator;
  errorMessage   : Locator;

  constructor(page: Page) {
    this.page            = page;
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.errorMessage    = page.locator('[data-test="error"]');
  }

  // Check if checkout step 1 is loaded
  async isLoaded() {
    return await this.firstNameInput.isVisible();
  }

  // Fill checkout form
  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  // Continue to checkout step 2
  async continue() {
    await this.continueButton.click();
  }

  // Cancel checkout and return to cart
  async cancel() {
    await this.cancelButton.click();
  }

  // Get error message if form validation fails
  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}
