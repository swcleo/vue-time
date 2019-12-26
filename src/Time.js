const EventEmitter = require('events')
const DateTime = require('datetime')
const format = require('date-format')

export function getTimeOfTimezone(changeTimezone) {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset()
  const time =
    date.getTime() + timezoneOffset * 60 * 1000 + changeTimezone * 60 * 1000
  return time
}

function ISO8601Format(date, timezoneOffset) {
  const time = format('yyyy-MM-ddThh:mm:ss', date)
  const offset = timezoneOffset / 60
  const symbol = offset >= 0 ? '+' : '-'
  const int = Math.abs(offset)
  const zone = int >= 0 && int < 10 ? `0${int}` : int

  return `${time}${symbol}${zone}:00`
}

function checkTimestamp(timestamp) {
  let ts = timestamp

  if (`${ts}`.length === 10) {
    ts = ts * 1000
  }

  return ts
}

class Time {
  constructor() {
    this.dateTime = new DateTime()

    this.events = new EventEmitter()

    this.offset = this.dateTime.getTimezoneOffset()

    this._timer = setInterval(() => {
      this.dateTime.setTime(this.dateTime.getTime() + 1000)
      this.events.emit('tick', this.dateTime.getTime())
    }, 1000)
  }

  update(timestamp) {
    if (!timestamp) {
      return
    }

    const ts = checkTimestamp(timestamp)

    this.dateTime.setTime(ts)

    this.events.emit('update', this.dateTime.getTime() / 1000)

    return this
  }

  getTime() {
    return this.dateTime.getTime()
  }

  getUnixTime() {
    return Math.floor(this.dateTime.getTime() / 1000)
  }

  utcOffset(offset) {
    const timeOffset = -1 * offset

    if (timeOffset || timeOffset === 0) {
      this.dateTime.setTimezoneOffset(timeOffset)
      this.offset = timeOffset
    }

    return -1 * this.offset
  }

  format(type) {
    const offset = this.utcOffset()

    if (type) {
      return format(type, this.dateTime.date)
    }

    return ISO8601Format(this.dateTime.date, offset)
  }

  on(evnetName, listener) {
    this.events.on(evnetName, listener)
  }

  off(evnetName, listener) {
    this.events.removeListener(evnetName, listener)
  }

  transformTimestampToStr(timestamp, formatOfStr) {
    const ts = checkTimestamp(timestamp)
    const diff = Date.now() - getTimeOfTimezone(this.utcOffset())
    const time = new Date(ts)
    const date = new Date(time.getTime() - diff)

    return formatOfStr
      ? format(formatOfStr, date)
      : ISO8601Format(date, this.utcOffset())
  }

  transformStrToTimestamp(str, formatOfStr) {
    const diff = Date.now() - getTimeOfTimezone(this.utcOffset())
    const time = format.parse(formatOfStr, str)
    const ts = time.getTime() + diff
    return Math.floor(ts / 1000)
  }
}

module.exports = Time
