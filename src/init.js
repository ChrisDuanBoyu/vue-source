import { initState } from "./state"
import {compileToFunctions} from './compiler/index'
import {callHook, mountComponent} from './lifecycle'
import { mergeOptions } from "./util"
export function initMixin(Vue){
  Vue.prototype._init = function(options){
    const vm  = this
    // 和构造函数上合并 不能直接取Vue 因为可能是Vue.extend 得到的新的构造函数
    vm.$options = mergeOptions(vm.constructor.options,options)
    callHook(vm,'beforeCreate')
    // 初始化状态（数据劫持）
    initState(vm)
    callHook(vm,'created')

    if(vm.$options.el){}
    vm.$mount(vm.$options.el)
  }
  Vue.prototype,$mount = function(el){
    const vm = this;
    el = document.querySelector(el)
    // 真实挂载的DOM节点  先记录在实例上面
    vm.$el = el
    const options = vm.$options
    if(!options.render){
      //没有render 转换template
      let template =options.template
      if(!template && el){
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render 
    }
     // 真正渲染的时候走的都是这个render方法
     //挂载这个组件
     callHook(vm,'beforeMount')
     mountComponent(vm,el)
     callHook(vm,'mounted')
     
  }
}