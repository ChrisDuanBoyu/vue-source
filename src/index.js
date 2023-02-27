import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "../vdom/index"
import {initGlobalAPI} from './global-api/index'
import { stateMixin } from "./state"
function Vue(options){
  this._init()
}

//原型方法的mixin
initMixin(Vue)
lifecycleMixin(Vue)  // 为实例注入生命周期方法
renderMixin(Vue)  // 注入_render方法 生成虚拟DOM

stateMixin(Vue)

initGlobalAPI(Vue)

export default Vue
