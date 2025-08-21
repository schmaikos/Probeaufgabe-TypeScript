import { Page, Locator } from "@playwright/test";

const BASE_URL = 'https://www.saucedemo.com/';

// Page Object for login functionality
export class LoginPage {
  // Elements
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

  // Check if login page is loaded
  async isLoaded() {
    return await this.usernameInput.isVisible();
  }

  // Navigate to the application
  async gotoLandingPage() {
    return await this.page.goto(BASE_URL);
  }

  // Login with credentials
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Get login error message
  async getErrorMessage() {
    return await this.errorMessage.isVisible() ?
      await this.errorMessage.textContent(): 
      null;
  }

  // Check if error message is visible
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}
