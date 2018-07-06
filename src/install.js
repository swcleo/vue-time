const Time = require('./Time')

let Vue

function install(_Vue) {
  Vue = _Vue

  install.installed = true

  Vue.prototype.$time = new Time()
}

module.exports = install
