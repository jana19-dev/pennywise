export const formatDate = (dateTime) => {
  // Format to YYYY-MM-DD
  // if dateTime is an object, convert it to a string first
  if (typeof dateTime === `object`) {
    dateTime = dateTime.toISOString()
  }
  if (dateTime.endsWith(`Z`)) {
    // get date after adjusting for timezone in current browser
    dateTime = new Date(dateTime).toLocaleString(`en-US`, {
      year: `numeric`,
      month: `2-digit`,
      day: `2-digit`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    // convert to ISO format
    dateTime = new Date(dateTime).toISOString()
  }
  const [date] = dateTime.split(`T`)
  const dateTimeObject = new Date(date + `T00:00:00`)
  const year = dateTimeObject.getFullYear()
  const month = `0${dateTimeObject.getMonth() + 1}`.slice(-2)
  const day = `0${dateTimeObject.getDate()}`.slice(-2)
  return `${year}-${month}-${day}`
}

export const formatTime = (dateTime) => {
  // if dateTime is not a date object, convert it to one first
  if (typeof dateTime === `string`) {
    // covert a time only string to a date object: HH:MM -> 1970-01-01THH:MM
    if (dateTime.length >= 5) {
      dateTime = `1970-01-01T${dateTime}`
    }
  }
  // Format to H:MM AM/PM
  const dateTimeObject = new Date(dateTime)
  const hours = dateTimeObject.getHours()
  const minutes = `0${dateTimeObject.getMinutes()}`.slice(-2)
  const ampm = hours >= 12 ? `PM` : `AM`
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes} ${ampm}`
}

export const formatDateTime = (dateTime) => {
  // Format to YYYY-MM-DD, HH:MM AM/PM
  if (typeof dateTime === `object`) {
    dateTime = dateTime.toISOString()
  }
  const [date, time] = dateTime.split(`T`)
  return `${formatDate(date)}, ${formatTime(time)}`
}
