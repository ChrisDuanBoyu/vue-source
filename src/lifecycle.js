import {patch} from '../vdom/patch'
import Watcher from './observer/watcher'
export function lifecycleMixin(Vue){
    Vue.prototype._update = function (vnode){
        //将虚拟节点渲染成真实DOM节点 用新创建的元素替换掉原有的el
        //需要区分首次渲染还是更新

        if(!this.vnode){
            this.vnode = vnode
            this.$el= patch(this.$el,vnode)
        }else{
            this.$el = patch(this.vnode,vnode)
        }
       
       
    }

}

export function mountComponent(vm,el){
    //调用render方法 渲染el属性
    //先调用render函数创建虚拟节点 再将节点渲染到页面上

    

    let updateComponent = ()=>{
        vm._update(vm._render())
    }
    //new 一个watcher的时候 就执行了一次渲染和更新方法
    new Watcher(vm,updateComponent,()=>{
        callHook(vm,'updated')
    },true)
  
    
}



export function callHook(vm,hook) {
    const handlers = vm.$options[hook]
    if(handlers){
        handlers.forEach(handler => {
            handler[i].call(vm)
        });
    }
}