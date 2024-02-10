import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'
import { fakeSchool, fakeUser } from 'utils/fakeData'

const { email, name: schoolName, address, phone } = fakeSchool()
const { email: librarianEmail, password: userPassword } = fakeUser()
const { email: studentEmail } = fakeUser()
const adminEmail: string = 'admin@gmail.com'

test.describe('Admin happy path for creating a school and a librarian', () => {
  test('log in as admin', async ({ page }) => {
    await page.goto('/')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toBeHidden()

    // login as admin
    await page.locator('input[type="email"]').click()
    await page.locator('input[type="email"]').fill(adminEmail)
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]').fill(userPassword)
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(dashboardLink).toBeVisible()
    await page.reload()
    await expect(dashboardLink).toBeVisible()
  })

  test('Happy path for creating a school', async ({ page }) => {
    // create School for further tests
    await loginNewUser(page, { email: adminEmail, password: userPassword })
    const successMessage = page.getByTestId('successMessage')
    await page.goto('/dashboard')

    await page.getByRole('link', { name: 'Create School' }).click()
    await page.getByRole('textbox', { name: 'Name' }).click()
    await page.getByRole('textbox', { name: 'Name' }).fill(schoolName)
    await page.getByRole('textbox', { name: 'Address' }).click()
    await page.getByRole('textbox', { name: 'Address' }).fill(address)
    await page.getByRole('textbox', { name: 'Phone' }).click()
    await page.getByRole('textbox', { name: 'Phone' }).fill(phone)
    await page.getByRole('textbox', { name: 'Email' }).click()
    await page.getByRole('textbox', { name: 'Email' }).fill(email)
    await page.getByRole('button', { name: 'Create School' }).click()

    await expect(successMessage).toBeVisible()
  })

  test('Happy path for creating a librarian', async ({ page }) => {
    // create Librarian for further tests
    await loginNewUser(page, { email: adminEmail, password: userPassword })
    const successMessage = page.getByTestId('successMessage')
    await page.goto('/dashboard')

    await page.getByRole('link', { name: 'Create Librarian' }).click()
    await page.locator('input[type="email"]').click()
    await page.locator('input[type="email"]').fill(librarianEmail)
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]').fill(userPassword)
    await page
      .locator('div')
      .filter({ hasText: /^Name$/ })
      .getByRole('textbox')
      .click()
    await page
      .locator('div')
      .filter({ hasText: /^Name$/ })
      .getByRole('textbox')
      .fill('Some Librarian')
    await page.getByRole('textbox').nth(3).click()
    await page.getByRole('textbox').nth(3).fill(schoolName)
    await page.getByText(schoolName).click()
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(successMessage).toBeVisible()
  })
})

test.describe('Librarian happy path for creating a book', () => {
  test('log in as librarian and make sure there is no book', async ({ page }) => {
    await page.goto('/')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toBeHidden()

    // login as librarian
    await page.locator('input[type="email"]').click()
    await page.locator('input[type="email"]').fill(librarianEmail)
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]').fill(userPassword)
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect(dashboardLink).toBeVisible()
    await page.reload()
    await expect(dashboardLink).toBeVisible()

    // There should be no book
    const bookListEmpty = page.getByTestId('bookListEmpty')
    await page.getByTestId('bookListEmpty').click()
    await expect(bookListEmpty).toBeVisible()
  })

  test('Librarian happy path for creating a book', async ({ page }) => {
    await loginNewUser(page, { email: librarianEmail, password: userPassword })
    await page.goto('/dashboard')

    const bookListEmpty = page.getByTestId('bookListEmpty')

    // create a book
    await page.getByRole('link', { name: 'Create Book' }).click()
    await page.getByRole('textbox', { name: 'ISBN' }).click()
    await page.getByRole('textbox', { name: 'ISBN' }).fill('9780140328721')
    await page.getByTestId('bookQuantityInput').click()
    await page.getByTestId('bookQuantityInput').fill('2')
    await page.getByLabel('CreateBook').click()
    await page.getByRole('button', { name: 'Create Book' }).click()
    const successMessage = page.getByTestId('successMessage')
    await expect(successMessage).toBeVisible()

    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(bookListEmpty).toBeHidden()
    await page.getByRole('link', { name: 'Logout' }).click()
  })
})

test.describe('Student happy path for signing up and reserving a book', () => {
  test('Student happy path for signing up', async ({ page }) => {
    await page.goto('/')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toBeHidden()

    // Sign up as a student
    const successMessage = page.getByTestId('successMessage')

    await page.getByRole('link', { name: 'Sign up' }).click()
    await page.locator('input[type="email"]').click()
    await page.locator('input[type="email"]').fill(studentEmail)
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]').fill(userPassword)
    await page
      .locator('div')
      .filter({ hasText: /^Name$/ })
      .getByRole('textbox')
      .click()
    await page
      .locator('div')
      .filter({ hasText: /^Name$/ })
      .getByRole('textbox')
      .fill('Student')
    await page.getByRole('textbox').nth(3).click()
    await page.getByRole('textbox').nth(3).fill(schoolName)
    await page.getByText(schoolName).click()
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(successMessage).toBeVisible()
  })

  test('Student happy path for loging in', async ({ page }) => {
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })

    // Login as a student
    await page.goto('/')
    await page.locator('input[type="email"]').click()
    await page.locator('input[type="email"]').fill(studentEmail)
    await page.locator('input[name="password"]').click()
    await page.locator('input[name="password"]').fill(userPassword)
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(dashboardLink).toBeVisible()

    await page.reload()
    await expect(dashboardLink).toBeVisible()
  })

  test('Student happy path for reserving and canceling a book', async ({ page }) => {
    await loginNewUser(page, { email: studentEmail, password: userPassword })
    await page.goto('/dashboard')

    // Reserve a book and then cancel the reservation
    await page.getByTestId('bookShowcase').click()
    await page.getByRole('button', { name: 'Reserve' }).click()
    await page.getByRole('link', { name: 'Manage Reservations' }).click()
    await page.getByTestId('cancelReservation').click()

    // check if the reservation was canceled
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await page.getByTestId('bookShowcase').click()
    await page.getByRole('link', { name: 'Manage Reservations' }).click()
    const canceled = page.getByTestId('Canceled')
    expect(canceled).toBeVisible()

    // reserve a book again
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await page.getByTestId('bookShowcase').click()
    await page.getByRole('button', { name: 'Reserve' }).click()
    await page.getByRole('link', { name: 'Manage Reservations' }).click()

    // check if the reservation is active and the old one is still canceled
    const active = page.getByTestId('Active')
    expect(active).toBeVisible()
    expect(canceled).toBeVisible()
  })
})

test.describe('Librarian happy path for managing reservations', () => {
  test('Librarian happy path for completing a reservation', async ({ page }) => {
    await loginNewUser(page, { email: librarianEmail, password: userPassword })
    await page.goto('/dashboard')

    // Check the existing reservations of students
    await page.getByRole('link', { name: 'Manage Reservations' }).click()
    await page.getByTestId('completeReservation').click()
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await page.getByRole('link', { name: 'Manage Reservations' }).click()
    await page.getByTestId('Completed').click()
  })
})
