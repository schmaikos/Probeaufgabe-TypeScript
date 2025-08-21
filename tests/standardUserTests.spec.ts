import { test, expect, Page } from '@playwright/test';
import { POManager } from '../POM_objects/POManager';
import { SideMenu } from '../utils/SideMenu';
import { CartBadge } from '../utils/CartBadge';

const validUsers = require('../test-data/validUsers.json');
const standardUser = validUsers.find(user => user.username === 'standard_user');

// Test suite for Standard User
test.describe('Standard user tests @regression', () => {
  let poManager: POManager;
  let sideMenu: SideMenu;
  let cartBadge: CartBadge;

  test.beforeEach(async ({ page }: { page: Page }) => {
    poManager = new POManager(page);
    sideMenu = new SideMenu(page);
    cartBadge = new CartBadge(page);

    // Login as Standard User
    const loginPage = poManager.loginPage;
    await loginPage.gotoLandingPage();
    await loginPage.login(standardUser.username, standardUser.password);
    const inventoryPage = poManager.inventoryPage;
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  test.describe('Inventory page tests', () => {

    test('Add to cart', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      // Check that cart badge is not visible at the beginning
      expect(await cartBadge.isVisible()).toBeFalsy();
      for (let i = 0; i < items.length; i++) {
        const itemName = items[i];
        await inventoryPage.addItemToCart(itemName);
        // Verify button changed to 'Remove'
        expect(await inventoryPage.isItemInCart(itemName)).toBeTruthy();
        // Verify cart icon count incremented
        expect(await cartBadge.getCount()).toBe(i + 1);
      }
      // Go to cart and verify all items are present
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;
      expect(await cartPage.isLoaded()).toBeTruthy();
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toEqual(items);
    });

    test('Remove from cart', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      // Add all items first
      for (let i = 0; i < items.length; i++) {
        const itemName = items[i];
        await inventoryPage.addItemToCart(itemName);
      }
      // Remove items one by one and verify
      for (let i = 0; i < items.length; i++) {
        const itemName = items[i];
        await inventoryPage.removeItemFromCart(itemName);
        // Verify item is no longer in cart
        expect(await inventoryPage.isItemInCart(itemName)).toBeFalsy();
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

    test('sort name A to Z', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      await inventoryPage.selectSortOption('az');
      expect(await inventoryPage.getSelectedSortOption()).toBe('az');
      const items = await inventoryPage.getInventoryItems();
      const sorted = items.slice().sort();
      expect(items).toEqual(sorted);
    });

    test('Sort name Z to A', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      await inventoryPage.selectSortOption('za');
      expect(await inventoryPage.getSelectedSortOption()).toBe('za');
      const items = await inventoryPage.getInventoryItems();
      const sorted = items.slice().sort().reverse();
      expect(items).toEqual(sorted);
    });

    test('Sort price low to high', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      await inventoryPage.selectSortOption('lohi');
      expect(await inventoryPage.getSelectedSortOption()).toBe('lohi');
      const items = await inventoryPage.getInventoryItems();
      const prices: number[] = [];
      for (const itemName of items) {
        const priceText = await inventoryPage.getItemPrice(itemName);
        prices.push(parseFloat(priceText.replace('$', '')));
      }
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    test('Sort price high to low', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      await inventoryPage.selectSortOption('hilo');
      expect(await inventoryPage.getSelectedSortOption()).toBe('hilo');
      const items = await inventoryPage.getInventoryItems();
      const prices: number[] = [];
      for (const itemName of items) {
        const priceText = await inventoryPage.getItemPrice(itemName);
        prices.push(parseFloat(priceText.replace('$', '')));
      }
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });

    test('Inventory item images are correct', async ({ page }) => {
      test.skip(!!process.env.CI);
      
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      for (const itemName of items) {
        const imageLocator = await inventoryPage.getItemImageLocator(itemName);

        await imageLocator.waitFor({ state: 'visible' });
        await page.waitForLoadState('networkidle');

        await expect(imageLocator).toHaveScreenshot(`inventory-item-${itemName.toLowerCase().replace(/ /g, '-')}.png`);
      }
    });

    test('Product prices match products.json', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const products = require('../test-data/products.json');
      for (const product of products) {
        // Use InventoryPage method to get price for item
        const webPrice = await inventoryPage.getItemPrice(product.name);
        expect(webPrice).toBe(product.price);
      }
    });

  });

  test.describe('Item Detail Page Tests', () => {

    test('Item page by clicking item name', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      const itemDetailPage = poManager.itemDetailPage;

      // Test all items by clicking their names
      for (const selectedItem of items) {
        // Click on item name to navigate to detail page
        await inventoryPage.clickItemName(selectedItem);

        // Verify item detail page loaded
        expect(await itemDetailPage.isLoaded()).toBeTruthy();

        // Verify correct item details are displayed
        const detailItemName = await itemDetailPage.getItemName();
        expect(detailItemName).toContain(selectedItem);

        // Verify we can go back to inventory
        await itemDetailPage.backToProducts();
        expect(await inventoryPage.isLoaded()).toBeTruthy();
      }
    });

    test('Item page by clicking item image', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      const itemDetailPage = poManager.itemDetailPage;

      // Test all items by clicking their images
      for (const selectedItem of items) {
        // Click on item image to navigate to detail page
        await inventoryPage.clickItemImage(selectedItem);

        // Verify item detail page loaded
        expect(await itemDetailPage.isLoaded()).toBeTruthy();

        // Verify correct item details are displayed
        const detailItemName = await itemDetailPage.getItemName();
        expect(detailItemName).toContain(selectedItem);

        // Go back to inventory
        await itemDetailPage.backToProducts();
        expect(await inventoryPage.isLoaded()).toBeTruthy();
      }
    });

    test('Item page', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      const itemDetailPage = poManager.itemDetailPage;

      // Test button visibility and functionality for all items
      for (const selectedItem of items) {
        // Click on item image to navigate to detail page
        await inventoryPage.clickItemImage(selectedItem);

        // Verify item detail page loaded
        expect(await itemDetailPage.isLoaded()).toBeTruthy();

        // Verify add to cart button is visible
        const isAddButtonVisible = await itemDetailPage.isAddToCartButtonVisible();
        expect(isAddButtonVisible).toBeTruthy();

        // Add item to cart from detail page
        await itemDetailPage.addItemToCart();

        // Verify button changed to remove
        const isRemoveButtonVisible = await itemDetailPage.isRemoveFromCartButtonVisible();
        expect(isRemoveButtonVisible).toBeTruthy();

        // Remove item from cart on detail page to reset state for next iteration
        await itemDetailPage.removeItemFromCart();

        // Verify button changed back to add
        const isAddButtonVisibleAfterRemove = await itemDetailPage.isAddToCartButtonVisible();
        expect(isAddButtonVisibleAfterRemove).toBeTruthy();

        // Go back to inventory and verify item is not in cart
        await itemDetailPage.backToProducts();
        expect(await inventoryPage.isLoaded()).toBeTruthy();
        expect(await inventoryPage.isItemInCart(selectedItem)).toBeFalsy();
      }
    });

  });

  test.describe('Cart Page Tests', () => {

    test('Cart', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      // Go to cart from inventory
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;
      expect(await cartPage.isLoaded()).toBeTruthy();
      // Cart should be empty
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(0);
      // Click continue shopping
      await cartPage.continueShopping();
      // Add two items
      const items = await inventoryPage.getInventoryItems();
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
      const checkoutStepOne = poManager.checkoutStepOnePage;
      expect(await checkoutStepOne.isLoaded()).toBeTruthy();
    });

  });

  test.describe('Checkout Page Tests', () => {

    test('Checkout step one', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      // Go to cart from inventory
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;
      expect(await cartPage.isLoaded()).toBeTruthy();

      // Proceed to checkout step one
      await cartPage.proceedToCheckout();
      const checkoutStepOne = poManager.checkoutStepOnePage;
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
      const checkoutStepTwo = poManager.checkoutStepTwoPage;
      expect(await checkoutStepTwo.isLoaded()).toBeTruthy();
    });

    test('Checkout step two', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      // Go to cart from inventory
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;
      expect(await cartPage.isLoaded()).toBeTruthy();

      // Proceed to checkout step one
      await cartPage.proceedToCheckout();
      const checkoutStepOne = poManager.checkoutStepOnePage;
      expect(await checkoutStepOne.isLoaded()).toBeTruthy();

      // Load checkout user data
      const checkoutUser = require('../test-data/checkoutUser.json')[0];
      await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.zip);
      await checkoutStepOne.continue();

      // Verify checkout step two loaded
      const checkoutStepTwo = poManager.checkoutStepTwoPage;
      expect(await checkoutStepTwo.isLoaded()).toBeTruthy();

      // Verify item total is $0.00
      const itemTotalText = await checkoutStepTwo.getItemTotal();
      expect(itemTotalText).toContain('Item total: $0');

      // Go back to inventory page
      await checkoutStepTwo.cancelCheckout();
      expect(await inventoryPage.isLoaded()).toBeTruthy();

      // Add 4 items
      const items = await inventoryPage.getInventoryItems();
      const addedItems = items.slice(0, 4);
      let expectedTotal = 0;
      for (const itemName of addedItems) {
        await inventoryPage.addItemToCart(itemName);
        // Get price for each item and sum
        const priceText = await inventoryPage.getItemPrice(itemName);
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
      const itemTotalValue = itemTotalTextAfterAdd ? parseFloat(itemTotalTextAfterAdd.replace(/[^\d.]/g, '')) : 0;
      expect(itemTotalValue).toBeCloseTo(expectedTotal, 2);
    });

    test('Verify completion page', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;

      // Go through checkout process without items (if possible)
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;

      await cartPage.proceedToCheckout();

      // Fill checkout step one
      const checkoutStepOne = poManager.checkoutStepOnePage;
      const checkoutUser = require('../test-data/checkoutUser.json')[0];
      await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.zip);
      await checkoutStepOne.continue();

      // Complete checkout step two
      const checkoutStepTwo = poManager.checkoutStepTwoPage;
      await checkoutStepTwo.finishCheckout();

      // Verify checkout complete page still shows proper elements
      const checkoutCompletePage = poManager.checkoutCompletePage;
      expect(await checkoutCompletePage.isLoaded()).toBeTruthy();

      // Verify completion header text
      const titleText = await checkoutCompletePage.getTitle();
      expect(titleText).toBe('Checkout: Complete!');

      // Verify completion message text
      const completeText = await checkoutCompletePage.getCompleteText();
      expect(completeText).toBe('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

      // Verify "Thank you for your order!" text is visible on the page
      const headerText = await checkoutCompletePage.getCompleteHeader();
      expect(headerText).toBe('Thank you for your order!');

      // Verify the pony image is visible
      const ponyImage = page.locator('img[alt*="Pony"], img[src*="pony"], .complete-image img');
      await expect(ponyImage).toBeVisible();

      // Verify back to home button is visible
      const backHomeButton = page.locator('[data-test="back-to-products"]');
      await expect(backHomeButton).toBeVisible();

      // Click back to home and verify we're back to inventory page
      await checkoutCompletePage.backToProducts();
      expect(await inventoryPage.isLoaded()).toBeTruthy();
    });

  });

  test.describe('Side Menu Tests', () => {

    test('Side menu', async ({ page }) => {
      // Verify menu button is visible using SideMenu public property
      await expect(sideMenu.menuButton).toBeVisible();
      
      // Open menu using SideMenu POM
      await sideMenu.openMenu();
      
      // Verify menu container is visible using SideMenu public property
      await expect(sideMenu.sideMenu).toBeVisible();
      
      // Verify menu links are visible using SideMenu public properties
      await expect(sideMenu.allItemsLink).toBeVisible();
      await expect(sideMenu.aboutLink).toBeVisible();
      await expect(sideMenu.logoutLink).toBeVisible();
      await expect(sideMenu.resetAppStateLink).toBeVisible();
      
      // Close menu using SideMenu POM
      await sideMenu.closeMenu();
      
      // Verify menu container is hidden
      await expect(sideMenu.sideMenu).not.toBeVisible();
    });

    test('About', async ({ page }) => {
      await sideMenu.openMenu();
      await sideMenu.clickAbout();
      await page.waitForURL('https://saucelabs.com/', { waitUntil: 'load' });
      expect(page.url()).toBe('https://saucelabs.com/');
    });

    test('Reset App State', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      // Add first two items to cart
      const addedItems = items.slice(0, 2);
      for (const itemName of addedItems) {
        await inventoryPage.addItemToCart(itemName);
      }
      // Change sorting to Z to A
      await inventoryPage.selectSortOption('za');
      expect(await inventoryPage.getSelectedSortOption()).toBe('za');
      // Open side menu and click reset app state
      await sideMenu.openMenu();
      await sideMenu.clickResetAppState();
      await sideMenu.closeMenu();
      // Verify cart is empty
      expect(await cartBadge.isVisible()).toBeFalsy();
      // Verify sorting is back to default (A to Z)
      expect(await inventoryPage.getSelectedSortOption()).toBe('az');
      // Verify items can be added to cart again
      for (const itemName of addedItems) {
        expect(await inventoryPage.isItemInCart(itemName)).toBeFalsy();
      }
    });

    test('Logout', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;

      // Verify we're logged in and on inventory page
      expect(await inventoryPage.isLoaded()).toBeTruthy();

      // Logout using side menu
      await sideMenu.openMenu();
      await sideMenu.clickLogout();

      // Verify we're redirected to login page
      const loginPage = poManager.loginPage;
      expect(await loginPage.isLoaded()).toBeTruthy();
    });

    test('All items button', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();

      // Go to cart page
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;
      expect(await cartPage.isLoaded()).toBeTruthy();

      // Navigate back to inventory using All Items from cart
      await sideMenu.openMenu();
      await sideMenu.clickAllItems();
      expect(await inventoryPage.isLoaded()).toBeTruthy();

      // Go to cart again and proceed to checkout
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();

      // Verify checkout step one loaded
      const checkoutStepOne = poManager.checkoutStepOnePage;
      expect(await checkoutStepOne.isLoaded()).toBeTruthy();

      // Navigate back to inventory using All Items from checkout step one
      await sideMenu.openMenu();
      await sideMenu.clickAllItems();
      expect(await inventoryPage.isLoaded()).toBeTruthy();

      // Go through checkout process again
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();

      // Fill checkout step one
      const checkoutUser = require('../test-data/checkoutUser.json')[0];
      await checkoutStepOne.fillCheckoutForm(checkoutUser.firstName, checkoutUser.lastName, checkoutUser.zip);
      await checkoutStepOne.continue();

      // Verify checkout step two loaded
      const checkoutStepTwo = poManager.checkoutStepTwoPage;
      expect(await checkoutStepTwo.isLoaded()).toBeTruthy();

      // Navigate back to inventory using All Items from checkout step two
      await sideMenu.openMenu();
      await sideMenu.clickAllItems();
      expect(await inventoryPage.isLoaded()).toBeTruthy();
    });

    test('Persistency', async ({ page }) => {
      const inventoryPage = poManager.inventoryPage;
      const items = await inventoryPage.getInventoryItems();
      const selectedItems = items.slice(0, 2);
      for (const itemName of selectedItems) {
        await inventoryPage.addItemToCart(itemName);
      }

      // Logout using SideMenu
      await sideMenu.openMenu();
      await page.locator('#logout_sidebar_link').click();

      const loginPage = poManager.loginPage;
      await loginPage.gotoLandingPage();
      await loginPage.login(standardUser.username, standardUser.password);
      // Go to cart and verify items
      await inventoryPage.goToCart();
      const cartPage = poManager.cartPage;
      expect(await cartPage.isLoaded()).toBeTruthy();
      const cartItems = await cartPage.getCartItems();
      expect(cartItems).toEqual(selectedItems);
    });

  });

});
