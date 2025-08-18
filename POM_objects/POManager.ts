import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { InventoryPage } from "./InventoryPage";
import { CartPage } from "./CartPage";
import { CheckoutStepOnePage } from "./CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "./CheckoutStepTwoPage";
import { CheckoutCompletePage } from "./CheckoutCompletePage";

export class POManager {
  page                : Page;
  loginPage           : LoginPage;
  inventoryPage       : InventoryPage;
  cartPage            : CartPage;
  checkoutStepOnePage : CheckoutStepOnePage;
  checkoutStepTwoPage : CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;

  constructor(page: Page) {
    this.page                 = page;
    this.loginPage            = new LoginPage(page);
    this.inventoryPage        = new InventoryPage(page);
    this.cartPage             = new CartPage(page);
    this.checkoutStepOnePage  = new CheckoutStepOnePage(page);
    this.checkoutStepTwoPage  = new CheckoutStepTwoPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getInventoryPage(): InventoryPage {
    return this.inventoryPage;
  }

  getCartPage(): CartPage {
    return this.cartPage;
  }

  getCheckoutStepOnePage(): CheckoutStepOnePage {
    return this.checkoutStepOnePage;
  }

  getCheckoutStepTwoPage(): CheckoutStepTwoPage {
    return this.checkoutStepTwoPage;
  }

  getCheckoutCompletePage(): CheckoutCompletePage {
    return this.checkoutCompletePage;
  }
}

module.exports = { POManager };
