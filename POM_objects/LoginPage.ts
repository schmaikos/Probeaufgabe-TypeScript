import { Page, Locator } from "@playwright/test";

const BASE_URL = 'https://www.saucedemo.com/';

export class LoginPage {
  private page         : Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton  : Locator;
  private errorMessage : Locator;

  constructor(page: Page) {
    this.page          = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('#login-button');
    this.errorMessage  = page.locator('[data-test="error"]');
  }


  async isLoaded() {
    return await this.usernameInput.isVisible();
  }

  async gotoLandingPage(){
    return await this.page.goto(BASE_URL);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(){
    return await this.errorMessage.isVisible() ? 
      await this.errorMessage.textContent(): 
      null;
  }
}
