import dateFns from "date-fns"

const dateRangeResponse = (
  startDate = dateFns.startOfDay(dateFns.addDays(new Date(), -6)), // default to 7 days ago
  endDate = dateFns.endOfDay(new Date()) // default to today
) => {
  // Construct the period date range and timeAdder
  let timeAdder, formatString
  const periodDays = dateFns.differenceInDays(new Date(endDate), new Date(startDate))
  if (periodDays < 1) {
    startDate = dateFns.startOfDay(new Date(startDate))
    endDate = dateFns.endOfDay(new Date(endDate))
    timeAdder = dateFns.addHours
    formatString = `MMM do, h a`
  } else if (periodDays <= 45) {
    startDate = dateFns.startOfDay(new Date(startDate))
    endDate = dateFns.endOfDay(new Date(endDate))
    timeAdder = dateFns.addDays
    formatString = `MMM do`
  } else if (periodDays > 45) {
    startDate = dateFns.startOfMonth(new Date(startDate))
    endDate = dateFns.endOfMonth(new Date(endDate))
    timeAdder = dateFns.addMonths
    formatString = `MMM yyyy`
  } else if (periodDays > 1095) {
    startDate = dateFns.startOfYear(new Date(startDate))
    endDate = dateFns.endOfYear(new Date(endDate))
    timeAdder = dateFns.addYears
    formatString = `yyyy`
  }

  // Create the response array
  const response = []
  let currentDate = startDate
  while (currentDate < endDate) {
    const nextDate = timeAdder(currentDate, 1)
    response.push({
      startDate: currentDate,
      endDate: nextDate,
      day: dateFns.format(currentDate, formatString),
      income: 0,
      expenses: 0
    })
    currentDate = nextDate
  }

  return { response, startDate, endDate, formatString }
}

export default dateRangeResponse
