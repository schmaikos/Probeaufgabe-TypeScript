import { test, expect, Page } from '@playwright/test';
import { POManager } from '../POM_objects/POManager';

const validUsers = require('../test-data/validUsers.json');
const invalidUsers = require('../test-data/invalidUsers.json');

test.describe('Login page tests', () => {

  let poManager: POManager;

  test.beforeEach(async ({ page }: { page: Page }) => {
    // Initialize POM manager
    poManager = new POManager(page);
    const loginPage = poManager.loginPage;
    await loginPage.gotoLandingPage();
  });

  test.describe('Login page tests', () => {

    test('Empty login', async ({ page }) => {
      const loginPage = poManager.loginPage;

      // Try to login with empty fields
      await loginPage.login('', '');

      // Verify error message appears
      expect(await loginPage.isErrorVisible()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Username is required');
    });

    test('Only user name login', async ({ page }) => {
      const loginPage = poManager.loginPage;

      // Try to login with only username
      await loginPage.login('standard_user', '');

      // Verify error message appears
      expect(await loginPage.isErrorVisible()).toBeTruthy();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('Password is required');
    });

    test('Valid login', async ({ page }) => {
      const loginPage = poManager.loginPage;

      // Login with valid credentials
      await loginPage.login('standard_user', 'secret_sauce');

      // Verify no error message
      expect(await loginPage.isErrorVisible()).toBeFalsy();

      // Verify successful login by checking inventory page loads
      const inventoryPage = poManager.inventoryPage;
      expect(await inventoryPage.isLoaded()).toBeTruthy();
    });

  });

  test.describe('Valid user login test', () => {

    validUsers.forEach(({ username, password }) => {
      test(`valid login for user: ${username}`, async ({ page }) => {
        const loginPage = poManager.loginPage;

        // Special handling for locked_out_user
        if (username === 'locked_out_user') {
          await loginPage.login(username, password);
          expect(await loginPage.isErrorVisible()).toBeTruthy();
          const errorMessage = await loginPage.getErrorMessage();
          expect(errorMessage).toContain('Sorry, this user has been locked out');
          return;
        }

        // Normal login for other users
        await loginPage.login(username, password);
        const inventoryPage = poManager.inventoryPage;
        expect(await inventoryPage.isLoaded()).toBeTruthy();
      });
    });

  });

  test.describe('Invalid user login test', () => {

    // Negative login tests for all invalid users
    invalidUsers.forEach(({ username, password }) => {
      test(`invalid login for username: '${username}' and password: '${password}'`, async ({ page }) => {
        const loginPage = poManager.loginPage;
        await loginPage.login(username, password);
        expect(await loginPage.isErrorVisible()).toBeTruthy();
      });
    });

  });

});
