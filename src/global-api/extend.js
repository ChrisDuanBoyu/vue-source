import { mergeOptions } from "../util";

export function initExtend(Vue){
    let cid = 0;
    Vue.extend = function(extendOptions){
        // 创建一个子类 继承父类
        const Super = this;
        const sub = function VueComponent(options){
            this._init(options)
        }
        // es5继承
        sub.prototype = Object.create(Super.prototype)
        sub.prototype.constructor = sub
        sub.options = mergeOptions(Super.options,extendOptions)
        sub.components = Super.components
        SubmitEvent.cid = cid++
        return sub
    }
    
}



/**
 * 组件的渲染流程
 * 1. 调用Vue.component
 * 2. 内部使用Vue.extend 产生一个子类继承父类
 * 3. 创建子类实例的时候会调用父类的_init()方法 再去$mount
 * 4. 组件初始化就是new这个组件的构造函数 并且调用$mount
 * 5. 创建虚拟节点 根据标签名 筛选出组件的标签 生成组件的虚拟节点 多了一个componentOptions 包含构造函数和插槽
 * 6. 组件创建真实DOM（先渲染父组件）遇到组件的虚拟dom的时候 调用init方法 让那个组件初始化并且挂在 组件$mount之后会把dom放到vm.$el上 vnode.componentInstance就是这个组件的实例
 * 这样渲染的时候就取这个$el来渲染
 * 
 */
