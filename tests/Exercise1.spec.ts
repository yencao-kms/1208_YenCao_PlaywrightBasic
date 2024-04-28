import { test, expect } from '@playwright/test';

const COUNTRY = "New Zealand";

test('Exercise 1: Buy the iPhone 13 PRO', async ({ page }) => {
  await test.step("Step 1: Go to 'https://rahulshettyacademy.com/client', then login with valid credential", async () => {
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator("#userEmail").fill("rahulshetty@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");

    await page.locator("#login").click();
  });


  await test.step("Step 2: Click on “Add to Cart” for iPhone 13 PRO item", async () => {
    await page.locator("//div[@class='card-body' and ./h5[normalize-space(.)='IPHONE 13 PRO']]//button[./i[contains(@class,'shopping-cart')]]").click();
  });

  await test.step("Step 3: Go to the Cart page by clicking on the Cart button", async () => {
    await page.locator("//li//button[./i[contains(@class,'shopping-cart')]]").click();
  });

  await test.step("Step 4: Click on “Check out” button", async () => {
    await page.getByRole("button").getByText("Checkout").click();
  });

  await test.step("Step 5: Select country", async () => {
    await page.getByPlaceholder('Select Country').pressSequentially(COUNTRY);
    await page.getByRole('button', { name: COUNTRY }).click()
  });

  await test.step("Step 6: Click on 'Place Order'", async () => {
    await page.getByText('Place Order').click();
  });

  var orderId
  await test.step("Step 7: Get Order ID (64bd09e27244490f958937d0 for example in this case)", async () => {
    const orderIdStr: string = await page.locator("//label[@class='ng-star-inserted']").textContent() || "";
    orderId = orderIdStr.split("|").join("").trim()
  });

  await test.step("VP : Verify Order ID (at bellow image Get the Order ID) (64bd09e27244490f958937d0 for example in this case) at the Orders History page", async () => {
    await page.locator("//label[normalize-space(.)='Orders History Page']").click();
    await expect(page.locator(`//th[normalize-space(.)='${orderId}']`)).toBeVisible();
  });
});