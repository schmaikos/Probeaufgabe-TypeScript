import { Page, Locator } from "@playwright/test";

export class LoginPage {
  page         : Page;
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton  : Locator;
  errorMessage : Locator;

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

  async gotoLandigPage() {
    return this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
  }
}

module.exports = { LoginPage };
