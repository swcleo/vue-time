const dateformat = require('dateformat')

const SECOND = 1000

function Time() {
  this._date = new Date()
  this._timer = setInterval(this.tick.bind(this), 1000)
}

Time.prototype.tick = function () {
  const timestamp = this._date.getTime()
  this._date = new Date(timestamp + SECOND)
}

Time.prototype.format = function (...args) {
  return dateformat.apply(null, [this._date, ...args])
}

Time.prototype.update = function (updateTime) {
  // TODO: 待設定更新時間方式
}

module.exports = Time
