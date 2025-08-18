import { test, expect, Page } from '@playwright/test';
import { POManager } from '../POM_objects/POManager';
import { SideMenu } from '../utils/SideMenu';
import { CartBadge } from '../utils/CartBadge';

const validUsers = require('../test-data/validUsers.json');

const standardUser = validUsers.find(user => user.username === 'standard_user');

    // Test suite for Standard User

test.describe('Standard user tests @regression', () => {
  let poManager: POManager;
  let sideMenu : SideMenu;
  let cartBadge: CartBadge;

  test.beforeEach(async ({ page }: { page: Page }) => {
    poManager = new POManager(page);
    sideMenu  = new SideMenu(page);
    cartBadge = new CartBadge(page);
    
        // Login as Standard User
    const loginPage = poManager.getLoginPage();
    await loginPage.gotoLandigPage();
    await loginPage.login(standardUser.username, standardUser.password);
    const inventoryPage = poManager.getInventoryPage();
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  test('Add to cart', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const items         = await inventoryPage.getInventoryItems();
      // Check that cart badge is not visible at the beginning
    expect(await cartBadge.isVisible()).toBeFalsy();
    for (let i = 0; i < items.length; i++) {
      const itemName = items[i];
      await inventoryPage.addItemToCart(itemName);
          // Verify button changed to 'Remove'
      expect(await inventoryPage.removeFromCartButton(itemName).isVisible()).toBeTruthy();
      // Verify cart icon count incremented
    expect(await cartBadge.getCount()).toBe(i + 1);
    }
        // Go to cart and verify all items are present
    await inventoryPage.goToCart();
    const cartPage = poManager.getCartPage();
    expect(await cartPage.isLoaded()).toBeTruthy();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toEqual(items);
  });

  test('sort name A to Z', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const chosenOption  = 'Name (A to Z)';
    await inventoryPage.selectSortOption(chosenOption);
    expect(await inventoryPage.getSelectedSortOption()).toBe('az');
    const items  = await inventoryPage.getInventoryItems();
    const sorted = items.slice().sort();
    expect(items).toEqual(sorted);
  });

  test('Sort name Z to A', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const chosenOption  = 'Name (Z to A)';
    await inventoryPage.selectSortOption(chosenOption);
    expect(await inventoryPage.getSelectedSortOption()).toBe('za');
    const items  = await inventoryPage.getInventoryItems();
    const sorted = items.slice().sort().reverse();
    expect(items).toEqual(sorted);
  });

  test('Sort price low to high', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const chosenOption  = 'Price (low to high)';
    await inventoryPage.selectSortOption(chosenOption);
    expect(await inventoryPage.getSelectedSortOption()).toBe('lohi');
    const prices = await inventoryPage.page.$$eval(
      inventoryPage.itemPrice,
      (els) => els.map((el) => parseFloat(el.textContent?.replace('$', '') || '0'))
    );
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('Sort price high to low', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const chosenOption  = 'Price (high to low)';
    await inventoryPage.selectSortOption(chosenOption);
    expect(await inventoryPage.getSelectedSortOption()).toBe('hilo');
    const prices = await inventoryPage.page.$$eval(
      inventoryPage.itemPrice,
      (els) => els.map((el) => parseFloat(el.textContent?.replace('$', '') || '0'))
    );
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('Remove from cart', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const items         = await inventoryPage.getInventoryItems();
        // Add all items first
    for (let i = 0; i < items.length; i++) {
      const itemName = items[i];
      await inventoryPage.addItemToCart(itemName);
    }
        // Remove items one by one and verify
    for (let i = 0; i < items.length; i++) {
      const itemName = items[i];
      await inventoryPage.removeItemFromCart(itemName);
          // Verify button changed to 'Add to cart'
      expect(await inventoryPage.addToCartButton(itemName).isVisible()).toBeTruthy();
          // Verify cart icon count decremented
      if (items.length - (i + 1) === 0) {
        expect(await cartBadge.isVisible()).toBeFalsy();
      } else {
        expect(await cartBadge.getCount()).toBe(items.length - (i + 1));
      }
    }
        // After all removals, cart badge should be gone
    expect(await cartBadge.isVisible()).toBeFalsy();
  });

   test('Persistency', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const items         = await inventoryPage.getInventoryItems();
    const selectedItems = items.slice(0, 2);
    for (const itemName of selectedItems) {
      await inventoryPage.addToCartButton(itemName).click();
    }

        // Logout using SideMenu
    await sideMenu.openMenu();
    await page.locator('#logout_sidebar_link').click();

    const loginPage = poManager.getLoginPage();
    await loginPage.gotoLandigPage();
    await loginPage.login(standardUser.username, standardUser.password);
        // Go to cart and verify items
    const inventoryPageAfterLogin = poManager.getInventoryPage();
    await inventoryPageAfterLogin.cartIcon.click();
    const cartPage = poManager.getCartPage();
    expect(await cartPage.isLoaded()).toBeTruthy();
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toEqual(selectedItems);
  });

   test('Reset App State', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const items         = await inventoryPage.getInventoryItems();
        // Add first two items to cart
    const addedItems = items.slice(0, 2);
    for (const itemName of addedItems) {
      await inventoryPage.addItemToCart(itemName);
    }
        // Change sorting to Z to A
    await inventoryPage.selectSortOption('Name (Z to A)');
    expect(await inventoryPage.getSelectedSortOption()).toBe('za');
        // Open side menu and click reset app state
    await sideMenu.openMenu();
    await sideMenu.clickResetAppState();
    await sideMenu.closeMenu();
      // Verify cart is empty
    expect(await cartBadge.isVisible()).toBeFalsy();
        // Verify sorting is back to default (A to Z)
    expect(await inventoryPage.getSelectedSortOption()).toBe('az');
        // Verify 'Add to cart' buttons are visible for previously added items
    for (const itemName of addedItems) {
      expect(await inventoryPage.addToCartButton(itemName).isVisible()).toBeTruthy();
    }
  });

  test('About', async ({ page }) => {
    await sideMenu.openMenu();
    await sideMenu.clickAbout();
    await page.waitForURL('https://saucelabs.com/', { waitUntil: 'load' });
    expect(page.url()).toBe('https://saucelabs.com/');
    });

  test('Inventory item images are correct', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const items         = await inventoryPage.getInventoryItems();
    for (const itemName of items) {
      const imageLocator = await inventoryPage.getItemImageLocator(itemName);
      await expect(imageLocator).toHaveScreenshot(`inventory-item-${itemName.toLowerCase().replace(/ /g, '-')}.png`);
    }
  });

  test('Product prices match products.json', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
    const products      = require('../test-data/products.json');
    for (const product of products) {
        // Use InventoryPage method to get price for item
      const webPrice = await inventoryPage.getItemPrice(product.name);
      expect(webPrice).toBe(product.price);
    }
  });
  test('Cart', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
      // Go to cart from inventory
    await inventoryPage.goToCart();
    const cartPage = poManager.getCartPage();
    expect(await cartPage.isLoaded()).toBeTruthy();
      // Cart should be empty
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(0);
      // Click continue shopping
    await cartPage.continueShopping();
      // Add two items
    const items      = await inventoryPage.getInventoryItems();
    const addedItems = items.slice(0, 2);
    for (const itemName of addedItems) {
      await inventoryPage.addItemToCart(itemName);
    }
      // Go to cart and verify two items
    await inventoryPage.goToCart();
    expect(await cartPage.isLoaded()).toBeTruthy();
    const cartItemsAfterAdd = await cartPage.getCartItems();
    expect(cartItemsAfterAdd).toEqual(addedItems);
      // Remove one item
    await cartPage.removeItem(addedItems[0]);
    const cartItemsAfterRemove = await cartPage.getCartItems();
    expect(cartItemsAfterRemove).toEqual([addedItems[1]]);
      // Click checkout
    await cartPage.proceedToCheckout();
      // Optionally verify checkout page loaded
    const checkoutStepOne = poManager.getCheckoutStepOnePage();
    expect(await checkoutStepOne.isLoaded()).toBeTruthy();
  });

  test('Checkout step one', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
      // Go to cart from inventory
    await inventoryPage.goToCart();
    const cartPage = poManager.getCartPage();
    expect(await cartPage.isLoaded()).toBeTruthy();

      // Proceed to checkout step one
    await cartPage.proceedToCheckout();
    const checkoutStepOne = poManager.getCheckoutStepOnePage();
    expect(await checkoutStepOne.isLoaded()).toBeTruthy();

      // Load checkout user data
    const checkoutUser = require('../test-data/checkoutUser.json')[0];

      // Try to continue with all fields empty
    await checkoutStepOne.continue();
    expect(await checkoutStepOne.getErrorMessage()).toContain('First Name is required');

      // Fill first name, try again
    await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, '', '');
    await checkoutStepOne.continue();
    expect(await checkoutStepOne.getErrorMessage()).toContain('Last Name is required');

      // Fill last name, try again
    await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, '');
    await checkoutStepOne.continue();
    expect(await checkoutStepOne.getErrorMessage()).toContain('Postal Code is required');

      // Fill postal code, proceed
    await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.zip);
    await checkoutStepOne.continue();

      // Optionally verify next page loaded
    const checkoutStepTwo = poManager.getCheckoutStepTwoPage();
    expect(await checkoutStepTwo.isLoaded()).toBeTruthy();
  });

  test('Checkout step two', async ({ page }) => {
    const inventoryPage = poManager.getInventoryPage();
      // Go to cart from inventory
    await inventoryPage.goToCart();
    const cartPage = poManager.getCartPage();
    expect(await cartPage.isLoaded()).toBeTruthy();

      // Proceed to checkout step one
    await cartPage.proceedToCheckout();
    const checkoutStepOne = poManager.getCheckoutStepOnePage();
    expect(await checkoutStepOne.isLoaded()).toBeTruthy();

      // Load checkout user data
    const checkoutUser = require('../test-data/checkoutUser.json')[0];
    await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.zip);
    await checkoutStepOne.continue();

      // Verify checkout step two loaded
    const checkoutStepTwo = poManager.getCheckoutStepTwoPage();
    expect(await checkoutStepTwo.isLoaded()).toBeTruthy();

      // Verify item total is $0.00
    const itemTotalText = await checkoutStepTwo.getItemTotal();
    expect(itemTotalText).toContain('Item total: $0');

      // Go back to inventory page
    await checkoutStepTwo.cancelCheckout();
    expect(await inventoryPage.isLoaded()).toBeTruthy();

      // Add 4 items
    const items         = await inventoryPage.getInventoryItems();
    const addedItems    = items.slice(0, 4);
    let   expectedTotal = 0;
    for (const itemName of addedItems) {
      await inventoryPage.addItemToCart(itemName);
        // Get price for each item and sum
      const priceText      = await inventoryPage.getItemPrice(itemName);
            expectedTotal += parseFloat(priceText.replace('$', ''));
    }

      // Go to cart and proceed to checkout again
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.zip);
    await checkoutStepOne.continue();
    expect(await checkoutStepTwo.isLoaded()).toBeTruthy();

      // Verify item total matches sum of prices
    const itemTotalTextAfterAdd = await checkoutStepTwo.getItemTotal();
    const itemTotalValue        = itemTotalTextAfterAdd ? parseFloat(itemTotalTextAfterAdd.replace(/[^\d.]/g, '')) : 0;
    expect(itemTotalValue).toBeCloseTo(expectedTotal, 2);
  });

});
