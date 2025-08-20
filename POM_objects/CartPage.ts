import { Page, Locator } from "@playwright/test";

export class CartPage {
  private  itemTitle: string = ".inventory_item_name";
  private  itemPrice: string = ".inventory_item_price";

  private  page: Page;
  private  cartList: Locator;
  private  cartItems: Locator;
  private  checkoutButton: Locator;
  private  continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartList = page.locator(".cart_list");
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async isLoaded(){
    return await this.cartList.isVisible();
  }

  async getCartItems(){
    return await this.page.$$eval(this.itemTitle, (items) =>
      items.map((item) => item.textContent || ""),
    );
  }

  async removeItem(itemName: string){
    const buttonName = itemName.toLowerCase().replace(/ /g, "-");
    await this.page.locator(`button[data-test="remove-${buttonName}"]`).click();
  }

  async proceedToCheckout(){
    await this.checkoutButton.click();
  }

  async continueShopping(){
    await this.continueShoppingButton.click();
  }

  async getItemPrice(itemName: string){
    const itemLocator = await this.page.locator('.cart_item').filter({ hasText: itemName });
    const priceLocator = await itemLocator.locator(this.itemPrice);
    const price = await priceLocator.textContent();
    return price?.trim() || '';
  }
}
