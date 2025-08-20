import { Page, Locator } from "@playwright/test";

export class CheckoutStepOnePage {
  private page           : Page;
  private firstNameInput : Locator;
  private lastNameInput  : Locator;
  private postalCodeInput: Locator;
  private continueButton : Locator;
  private cancelButton   : Locator;
  private errorMessage   : Locator;

  constructor(page: Page) {
    this.page            = page;
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.errorMessage    = page.locator('[data-test="error"]');
  }

  async isLoaded(){
    return await this.firstNameInput.isVisible();
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string){
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(){
    await this.continueButton.click();
  }

  async cancel(){
    await this.cancelButton.click();
  }

  async getErrorMessage(){
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }
}
