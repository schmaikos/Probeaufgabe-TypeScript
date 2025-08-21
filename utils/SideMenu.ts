import { Page, Locator } from '@playwright/test';

// Class for side menu interactions
export class SideMenu {
  // Elements
  page              : Page;
  menuButton        : Locator;
  sideMenu          : Locator;
  allItemsLink      : Locator;
  aboutLink         : Locator;
  logoutLink        : Locator;
  resetAppStateLink : Locator;
  closeMenuButton   : Locator;

  constructor(page: Page) {
    this.page               = page;
    this.menuButton         = page.locator('#react-burger-menu-btn');
    this.sideMenu           = page.locator('.bm-menu');
    this.allItemsLink       = page.locator('#inventory_sidebar_link');
    this.aboutLink          = page.locator('#about_sidebar_link');
    this.logoutLink         = page.locator('#logout_sidebar_link');
    this.resetAppStateLink  = page.locator('#reset_sidebar_link');
    this.closeMenuButton    = page.locator('#react-burger-cross-btn');
  }

  // Open the side menu
  async openMenu() {
    await this.menuButton.click();
  }

  // Close the side menu
  async closeMenu() {
    await this.closeMenuButton.click();
  }

  // Navigate to all items page
  async clickAllItems() {
    await this.allItemsLink.click();
  }

  // Navigate to about page
  async clickAbout() {
    await this.aboutLink.click();
  }

  // Logout from application
  async clickLogout() {
    await this.logoutLink.click();
  }

  // Reset application state
  async clickResetAppState() {
    await this.resetAppStateLink.click();
  }
}
