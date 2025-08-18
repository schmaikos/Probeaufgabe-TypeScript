import { Page, Locator } from '@playwright/test';

export class SideMenu {
  page             : Page;
  menuButton       : Locator;
  sideMenu         : Locator;
  allItemsLink     : Locator;
  aboutLink        : Locator;
  logoutLink       : Locator;
  resetAppStateLink: Locator;
  closeMenuButton  : Locator;

  constructor(page: Page) {
    this.page              = page;
    this.menuButton        = page.locator('#react-burger-menu-btn');
    this.sideMenu          = page.locator('.bm-menu');
    this.allItemsLink      = page.locator('#inventory_sidebar_link');
    this.aboutLink         = page.locator('#about_sidebar_link');
    this.logoutLink        = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.closeMenuButton   = page.locator('#react-burger-cross-btn');
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async closeMenu() {
    await this.closeMenuButton.click();
  }

  async clickAllItems() {
    await this.allItemsLink.click();
  }

  async clickAbout() {
    await this.aboutLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async clickResetAppState() {
    await this.resetAppStateLink.click();
  }
}

module.exports = { SideMenu };
