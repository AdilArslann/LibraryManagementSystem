import { feeCalculator } from './index'

it('should calculate correctly', async () => {
  const totalFee = feeCalculator(new Date('2024-01-16'), [
    new Date('2024-01-13'),
    new Date('2024-01-10'),
  ])

  expect(totalFee).toEqual(2.5)
})
