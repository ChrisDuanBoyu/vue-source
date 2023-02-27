import {mergeOptions} from '../util'
import { initExtend } from './extend'
export function initGlobalAPI(Vue){
    Vue.options ={}
    Vue.mixin =function(mixin){
        //合并对象
        this.options =mergeOptions(this.options,mixin)
    }
    // 全局属性都放在Vue.options
    Vue.options.components ={}
    Vue.options._base = Vue  // 构造实例

    initExtend(Vue)
    Vue.component = function (id,definition){
        //Vue.extend
        definition.name =definition.name ||id //默认以名字为准
         //根据当前组件对象 生成了一个子类的构造函数
        definition = this.options._base.extend(definition) // 取的是父类
        Vue.options.components[id] = definition

    }
    
}