import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { InventoryPage } from "./InventoryPage";
import { CartPage } from "./CartPage";
import { CheckoutStepOnePage } from "./CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "./CheckoutStepTwoPage";
import { CheckoutCompletePage } from "./CheckoutCompletePage";

export class POManager {
  private _page                : Page;
  private _loginPage           : LoginPage;
  private _inventoryPage       : InventoryPage;
  private _cartPage            : CartPage;
  private _checkoutStepOnePage : CheckoutStepOnePage;
  private _checkoutStepTwoPage : CheckoutStepTwoPage;
  private _checkoutCompletePage: CheckoutCompletePage;

  constructor(page: Page) {
    this._page                 = page;
    this._loginPage            = new LoginPage(page);
    this._inventoryPage        = new InventoryPage(page);
    this._cartPage             = new CartPage(page);
    this._checkoutStepOnePage  = new CheckoutStepOnePage(page);
    this._checkoutStepTwoPage  = new CheckoutStepTwoPage(page);
    this._checkoutCompletePage = new CheckoutCompletePage(page);
  }

  get page(): Page {
    return this._page;
  }

  get loginPage(): LoginPage {
    return this._loginPage;
  }

  get inventoryPage(): InventoryPage {
    return this._inventoryPage;
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
