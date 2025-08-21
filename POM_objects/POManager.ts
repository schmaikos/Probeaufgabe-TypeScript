import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { InventoryPage } from "./InventoryPage";
import { ItemDetailPage } from "./ItemDetailPage";
import { CartPage } from "./CartPage";
import { CheckoutStepOnePage } from "./CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "./CheckoutStepTwoPage";
import { CheckoutCompletePage } from "./CheckoutCompletePage";

// Manager class to initialize and provide access to all page objects
export class POManager {
  // Page object instances
  _page                : Page;
  _loginPage           : LoginPage;
  _inventoryPage       : InventoryPage;
  _itemDetailPage      : ItemDetailPage;
  _cartPage            : CartPage;
  _checkoutStepOnePage : CheckoutStepOnePage;
  _checkoutStepTwoPage : CheckoutStepTwoPage;
  _checkoutCompletePage: CheckoutCompletePage;

  constructor(page: Page) {
    // Initialize all page objects
    this._page                 = page;
    this._loginPage            = new LoginPage(page);
    this._inventoryPage        = new InventoryPage(page);
    this._itemDetailPage       = new ItemDetailPage(page);
    this._cartPage             = new CartPage(page);
    this._checkoutStepOnePage  = new CheckoutStepOnePage(page);
    this._checkoutStepTwoPage  = new CheckoutStepTwoPage(page);
    this._checkoutCompletePage = new CheckoutCompletePage(page);
  }

  // Getter methods to access page objects
  get page(): Page {
    return this._page;
  }

  get loginPage(): LoginPage {
    return this._loginPage;
  }

  get inventoryPage(): InventoryPage {
    return this._inventoryPage;
  }

  get itemDetailPage(): ItemDetailPage {
    return this._itemDetailPage;
  }

  get cartPage(): CartPage {
    return this._cartPage;
  }

  get checkoutStepOnePage(): CheckoutStepOnePage {
    return this._checkoutStepOnePage;
  }

  get checkoutStepTwoPage(): CheckoutStepTwoPage {
    return this._checkoutStepTwoPage;
  }

  get checkoutCompletePage(): CheckoutCompletePage {
    return this._checkoutCompletePage;
  }
}
