const EventEmitter = require('events')
const moment = require('moment')
require('moment-timezone')

class Time {
  constructor() {
    this._moment = moment()

    this._events = new EventEmitter()

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

    this._moment = moment(+ts)
  }

  getTime() {
    return +this._moment
  }

  getUnixTime() {
    return this._moment.unix()
  }

  tz(timezone) {
    this._moment = this._moment.tz(timezone)
    return this
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
}

module.exports = Time
