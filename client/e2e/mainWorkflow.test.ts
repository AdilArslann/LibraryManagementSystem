import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'
import { fakeSchool, fakeUser } from 'utils/fakeData'

const { email, name: schoolName, address, phone } = fakeSchool()
const { email: librarianEmail, password: userPassword } = fakeUser()
const { email: studentEmail } = fakeUser()
const adminEmail: string = 'admin@gmail.com'

test.describe('Admin happy path for creating a school and a librarian', () => {
  test('log in as admin', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toBeHidden()

    // login as admin\
    await page.waitForLoadState('domcontentloaded')
    await page.locator('input[type="email"]').click()
    await page.locator('input[type="email"]').fill(adminEmail)
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]').fill(userPassword)
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(dashboardLink).toBeVisible()
    await page.reload()
    await expect(dashboardLink).toBeVisible()
  })
})
