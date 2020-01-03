import { Time } from './Time'

let Vue

export function install(_Vue) {

  Vue = _Vue

  install.installed = true

  Vue.prototype.$time = new Time()
}
