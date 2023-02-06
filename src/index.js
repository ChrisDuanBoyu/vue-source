import { initMixin } from "./init"

function Vue(options){
  this._init()
}


initMixin(Vue)


export default Vue
