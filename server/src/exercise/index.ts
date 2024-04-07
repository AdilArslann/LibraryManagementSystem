// takes 2 arguments
// 1. current date, 2. an array of dates
// each dates are the checkoutdates
// first 5 days 25 cents any additional days are 50 cents

export function feeCalculator(returnDate: Date, checkoutdates: Date[]): number {
  return checkoutdates
    .map((checkoutdate) => {
      const differenceMs = returnDate.getTime() - checkoutdate.getTime()
      const differenceDays = differenceMs / (1000 * 60 * 60 * 24)
      const fee =
        Math.min(5, differenceDays) * 0.25 +
        Math.max(0, differenceDays - 5) * 0.5
      return fee
    })
    .reduce((accumulated, current) => accumulated + current, 0)
}
