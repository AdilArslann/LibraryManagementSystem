// takes 2 arguments
// 1. current date, 2. an array of dates
// each dates are the checkoutdates
// first 5 days 25 cents any additional days are 50 cents

export function feeCalculator(returnDate: Date, checkoutdates: Date[]) {
  let fee = 0.0
  const [year, month, day] = dateToNumbers(returnDate)

  checkoutdates.forEach((datee) => {
    let difference = 0

    const [yearr, monthh, dayy] = dateToNumbers(datee)
    if (+year > +yearr) {
      const temp = +year - +yearr
      difference += temp * 365
    }
    if (+month > +monthh) {
      const temp = +month - +monthh
      difference += temp * 30
    }

    difference += +day - +dayy

    let i: number = 0

    while (i < difference) {
      if (i < 5) {
        fee += 0.25
      } else {
        fee += 0.5
      }
      i += 1
    }
  })
  return fee
}

function dateToNumbers(dateToBeModified: Date) {
  const [returnsDate] = dateToBeModified.toISOString().split('T')
  return returnsDate.split('-')
}
