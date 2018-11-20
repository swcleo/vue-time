const EventEmitter = require('events')
const moment = require('moment')
require('moment-timezone')

class Time {
  constructor() {
    this._moment = moment()

    this._events = new EventEmitter()

    this.offset = this._moment.utcOffset()

    this._timer = setInterval(() => {
      this._moment = this._moment.add(1, 'seconds')
      this._events.emit('tick', this.getTime())
    }, 1000)
  }

  update(timestamp) {
    if (!timestamp) {
      return
    }

    let ts = timestamp

    // 秒數長度檢查
    if (('' + ts).length === 10) {
      ts = ts * 1000
    }

    if (this.offset) {
      this._moment = moment(+ts).utcOffset(this.offset)
    } else {
      this._moment = moment(+ts)
    }

    if (this.timeZone) {
      this._moment = this._moment.tz(this.timeZone)
    }

    this._events.emit('update', this.getTime())

    return this
  }

  getTime() {
    return +this._moment
  }

  getUnixTime() {
    return this._moment.unix()
  }

  tz(timeZone) {
    this.timeZone = timeZone
    this._moment = this._moment.tz(timeZone)
    return this
  }

  utcOffset(offset) {
    if (offset) {
      this._moment.utcOffset(offset)
      this.offset = this._moment.utcOffset()
    }

    return this.offset
  }

  format(...args) {
    return this._moment.format.apply(this._moment, args)
  }

  on(evnetName, listener) {
    this._events.on(evnetName, listener)
  }

  off(evnetName, listener) {
    this._events.removeListener(evnetName, listener)
  }

  transformTimestampToStr(timestamp, formatOfStr) {
    let m = moment.unix(timestamp).utcOffset(this.offset)

    if (this.timeZone) {
      m = m.tz(this.timeZone)
    }

    return formatOfStr ? m.format(formatOfStr) : m.format()
  }

  transformStrToTimestamp(str, formatOfStr, isUTC) {
    let m

    if (this.timeZone) {
      m = moment.tz(str, formatOfStr, this.timeZone)
      return m.unix()
    }

    m = moment(str, formatOfStr)

    const x = m.unix()
    const offset = m.utcOffset()
    const t = x + offset * 60
    const ut =  t - 60 * this.offset

    return ut
  }
}

module.exports = Time
