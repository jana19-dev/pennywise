import dateFns from "date-fns"

const dateRangeResponse = (startDate = new Date(`2023-01-01`), endDate = new Date()) => {
  // Construct the period date range and timeAdder
  startDate = dateFns.startOfMonth(startDate)
  endDate = dateFns.endOfMonth(endDate)
  const timeAdder = dateFns.addMonths
  const formatString = `MMM yyyy`

  // Create the response array
  const response = []
  let currentDate = startDate
  while (currentDate < endDate) {
    const nextDate = timeAdder(currentDate, 1)
    response.push({
      startDate: currentDate,
      endDate: nextDate,
      day: dateFns.format(currentDate, formatString)
    })
    currentDate = nextDate
  }

  return { response, startDate, endDate, formatString }
}

export default dateRangeResponse
