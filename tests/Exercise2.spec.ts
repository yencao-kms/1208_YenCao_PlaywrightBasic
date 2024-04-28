import { expect, test } from "@playwright/test";
var username: string;
const validPassword = 'admin123';

const ORANGE_HRM_URL = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
const btnAddUser = "//button[contains(@class,'oxd-button') and normalize-space(.)='Add']";
const txtUserName = "input[name='username']"
const txtPassword = "input[name='password']"
const btnLogin = "button:has-text('Login')"

test.describe('Exercise 2: As a user, I am able to log in to OrangeHRM Login page with my credentials', () => {
  test.beforeEach('Pre-condition: Login to the OrangeHRM with the admin account and create an account on the Admin page', async ({ page }, testInfo) => {
    username = `TestUser${Math.random()}`
    testInfo.setTimeout(testInfo.timeout + 600000)
    await test.step("Pre-condition 1: Go to OrangeHRM Login page", async () => {
      await page.goto(ORANGE_HRM_URL, {waitUntil: 'load' });
    })

    await test.step("Pre-condition 2: Enter valid username and password", async () => {
      await page.locator(txtUserName).fill("Admin", { timeout: 15 * 60 * 1000 });
      await page.locator(txtPassword).fill("admin123");
    })

    await test.step("Pre-condition 3: Click the Login button", async () => {
      await page.locator(btnLogin).click();
    })

    await test.step("Pre-condition 3: Add a new user", async () => {
      await page.locator("//span[contains(@class,'oxd-main-menu-item--name') and normalize-space(.)='Admin']").click({ timeout: 10 * 60 * 1000 });
      await page.locator(btnAddUser).click()

      await page.locator("//div[contains(@class,'oxd-grid-item') and .//label[normalize-space(.)='User Role']]//div[contains(@class,'oxd-select-text--active')]//i").click();
      await page.getByRole('option', { name: 'Admin' }).click();

      await page.locator("//div[contains(@class,'oxd-grid-item') and .//label[normalize-space(.)='Status']]//div[contains(@class,'oxd-select-text--active')]//i").click();
      await page.getByRole('option', { name: 'Enabled' }).click();

      await page.locator("//div[contains(@class,'oxd-grid-item') and .//label[normalize-space(.)='Password']]//input").fill(validPassword)
      await page.locator("//div[contains(@class,'oxd-grid-item') and .//label[normalize-space(.)='Confirm Password']]//input").fill(validPassword)

      await page.locator("//div[contains(@class,'oxd-grid-item') and .//label[normalize-space(.)='Username']]//input").fill(username)
      await page.locator("//div[contains(@class,'oxd-grid-item') and .//label[normalize-space(.)='Employee Name']]//input").fill("Rahul Da")
      await page.getByText("Rahul  Das").first().click()

      await page.locator("//button[@type='submit' and normalize-space(.)='Save']").click();

      await page.locator(btnAddUser).waitFor({ state: "visible" })
    });

    await test.step("Pre-condition 4: Logout the admin account", async () => {
      await page.locator(".oxd-userdropdown").click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
    })
  })
  test("TC01: Verify that the user can log in successfully when provided the username and password correctly", async ({ page }) => {

    await test.step("Step 1: Go to OrangeHRM Login page", async () => {
      await page.goto(ORANGE_HRM_URL, {waitUntil: 'load' });
    })

    await test.step("Step 2: Input valid credentials for the account created at pre-condition", async () => {
      await page.locator(txtUserName).fill(username);
      await page.locator(txtPassword).fill(validPassword);
    })

    await test.step("Step 3: Click the Login button", async () => {
      await page.locator(btnLogin).click();
    })

    await test.step("VP: Verify that the Dashboard page is displayed", async () => {
      await expect(page).toHaveURL(
        "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"
      )
    });

  });

  test("TC02: Verify that the user can not log in successfully when providing username is empty", async ({ page }) => {

    await test.step("Step 1: Go to OrangeHRM Login page", async () => {
      await page.goto(ORANGE_HRM_URL, {waitUntil: 'load' });
    })

    await test.step("Step 2: Leave the username with a blank value", async () => {
      await page.locator(txtUserName).fill("", { timeout: 10 * 60 * 1000 });
    })

    await test.step("Step 3: Input the valid password", async () => {
      await page.locator(txtPassword).fill("admin1234");
    })

    await test.step("Step 4: Click the Login button", async () => {
      await page.locator(btnLogin).click();
    })

    await test.step("VP: Verify that the “Required” message is displayed below the username textbox", async () => {
      await expect(page.locator("//div[contains(@class,'oxd-input-group') and .//input[@name='username']]//span[contains(@class,'oxd-input-field-error-message')]")).toHaveText("Required");
    });
  });
});
