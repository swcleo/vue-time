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
  const absOffset = Math.abs(offset)
  const zone = absOffset >= 0 && absOffset < 10 ? `0${absOffset}` : absOffset

  return `${time}${symbol}${zone}:00`
}

function toTSMillisecond(ts) {
  let timestamp = ts

  if (`${timestamp}`.length === 10) {
    timestamp = timestamp * 1000
  }

  return timestamp
}

function stdTimezoneOffset(year) {
  const jan = new Date(year, 0, 1)
  const jul = new Date(year, 6, 1)
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
}

function isDST(ts) {
  const date = new Date(ts)
  return date.getTimezoneOffset() < stdTimezoneOffset(date.getFullYear())
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

    const ts = toTSMillisecond(timestamp)

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
    const ts = toTSMillisecond(timestamp)
    const time = new Date(ts)
    const diff = Date.now() - getTimeOfTimezone(this.utcOffset())

    let transformTime = time.getTime() - diff

    if (isDST(ts)) {
      transformTime = transformTime - 3600 * 1000
    }

    const date = new Date(transformTime)

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
