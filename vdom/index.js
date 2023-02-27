import { isReservedTag } from "../src/util"

export function renderMixin(Vue){

    Vue.prototype._c = function(){
      
        return createElement(this,...arguments)
    }

    // 不同类型节点渲染成vdom的方法
    Vue.prototype._s  =function (){
        // stringfy  // 调用JSON.stringfy方法

    }

    Vue.prototype._v =function (text){
        //创建文本元素
        return createTextNode(text)
    }

    Vue.prototype._render =function(){
        const vm = this
        const render =  vm.$options.render;

        //调用render函数 生成虚拟节点
        let vnode = render.call(vm)

        return vnode
    }
}



function createElement(vm,tag,data={},...children){

    // 如果是组件 要把组件的构造函数传入 根据tag名判断是否是一个组件
    if(isReservedTag(tag)){

        // 原生标签 直接创建元素虚拟DOM
        return vnode(tag,data,data.key,children)
    }else{
        let Ctor = vm.$options.components[tag] //找到组件的构造函数
        // 创建组件的虚拟节点
        createComponent(vm,tag,data,data.key,children,Ctor)
    }

     
}


function createTextNode(text){
    //创建文本虚拟dom
    return vnode(undefined,undefined,undefined,undefined,text)
}


function vnode(tag,data,key,children,text,componentOptions){
    // 组件的虚拟DOM多了ComponentOptions 保存构造函数和插槽
    return {tag,data,key,children,text, componentOptions}
}






function createComponent(vm,tag,data,key,children,Ctor){ //children就是插槽
   const baseCtor = vm.$options._base
    if (typeof Ctor ==='object'){
            Ctor = baseCtor.extend(Ctor) //转换成构造函数
    }
    data.hook ={   //初始化组件会调用的方法
        init(vnode){
            let child = vnode.componentInstance = new Ctor();
            child.$mount() //不传递el
        }
    }

    return vnode(`vue-component-${Ctor.cid}-${tag}`,data,data.key,undefined,undefined,{Ctor,children}){

    }

}