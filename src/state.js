import Dep from "./observer/dep"
import { observe } from "./observer/index"
import Watcher from "./observer/watcher"
import {nextTick, proxy} from './util'
export function initState(vm){
  vm.$options.data && initData(vm)
  vm.$options.Props && initProps(vm)
  vm.$options.methods && initMethods(vm)
  vm.$options.computed && initComputed(vm)
  vm.$options.initWatch && initWatch(vm)
}

export function stateMixin(Vue){
  Vue.prototype.$nextTick = function(cb){
    nextTick(cb)
  }
  Vue.prototype.$watch = function(expOrFun,cb,options){
    const vm =this
    let watcher = new Watcher(vm,expOrFun,cb,{...options,user:true}) // 用户watcher
    if(options.immediate){
      cb()
    }
  }
}
function initProps(){}

function initMethods(){}



function initData(){
  let data =vm.$options.data
  vm._data = typeof data ==='function'?data.call(vm):data

  // 对象 Object .defineProperty  数组单独处理
  observe(data)
  for(let key of data){
    proxy(vm,'_data',key)
  }
  
}

function initComputed(vm){
  const computed = vm.$options.computed
  // 需要建立watcher  通过 defineProperty  dirty
  const watchers = vm._computedWatchers ={} //存放计算属性的watcher
  for(let key in computed){
    const userDef = computed[key]
    const getter= typeof userDef ==='function'?userDef:userDef.get
    watchers[key] = new Watcher(vm,getter,()=>{},{lazy:true}) //懒执行 记录watcher
    defineComputed(vm,key,userDef)
  }
}


function initWatch(vm){
  const watch = vm.$options.watch
  for(let key in watch){
    const handler = watch[key]  // 可能是数组 字符串 对象或者函数
    if(Array.isArray(handler)){
      //对数组的处理
      handler.forEach(item=>createWatcher(vm,key,item))
    }else{
      createWatcher(vm,key,handler)
    }
  }

}



function createWatcher(vm,expOrFun,handler,options={}) { // options 用来标识是用户watcher
   
  if(typeof handler =='object'){
    handler = handler.handler
  }
  if(typeof handler =='string'){
    handler =vm[handler] // 用实例的方法作为handler
  }
  return vm.$watch(expOrFun,handler,options)
}




const sharedPropertyDef ={
  enumerable:true,
  configurable:true,
  get:()=>{},
  set:()=>{}
}

function  defineComputed(target,key,userDef){
  if(typeof userDef ==='function'){
    sharedPropertyDef.get =createComputedGetter(key)

  }else{
    sharedPropertyDef.get = createComputedGetter(key)
    sharedPropertyDef.set = userDef.set
  }
  Object.defineProperties(target,key,sharedPropertyDef)
  createWatcher(target,userDef.get,)
}


function createComputedGetter(key){

  return function(){
    //包装的方法
    if(dirty){
      //执行
       const watcher = this._computedWatchers[key]  //拿到属性对应的watcher
       if(watcher){
        if(watcher.dirty){
          watcher.evaluate()
          if(Dep.target){
            // 说明还有渲染watcher
            watcher.depend()
          }
        }
        return watcher.value // 默认返回的值
       }
    }
  }
}

