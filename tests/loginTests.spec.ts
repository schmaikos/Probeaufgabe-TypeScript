import { test, expect, Page } from '@playwright/test';
import { POManager } from '../POM_objects/POManager';
import { SideMenu } from '../utils/SideMenu';

const validUsers = require('../test-data/validUsers.json');
const invalidUsers = require('../test-data/invalidUsers.json');

test.describe('Login page tests', () => {

  let poManager: POManager;

  test.beforeEach(async ({ page } : { page: Page }) => {
      // Initialize POM manager
    poManager = new POManager(page);
    
  });

  validUsers.forEach(({ username, password }) => {
    test(`valid login for user: ${username}`, async ({ page }) => {
      const loginPage = poManager.getLoginPage();
      await loginPage.gotoLandigPage();
      await loginPage.login(username, password);
      const inventoryPage = poManager.getInventoryPage();
      expect(await inventoryPage.isLoaded()).toBeTruthy();
    });
  });

  // Negative login tests for all invalid users
  invalidUsers.forEach(({ username, password }) => {
    test(`invalid login for username: '${username}' and password: '${password}'`, async ({ page }) => {
      const loginPage = poManager.getLoginPage();
      await loginPage.gotoLandigPage();
      await loginPage.login(username, password);
      expect(await loginPage.errorMessage.isVisible()).toBeTruthy();
    });
  });



});
