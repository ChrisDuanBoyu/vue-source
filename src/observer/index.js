import {newArrayMethods} from './array'
import Dep from './dep'
class Observer {
  constructor(value){
    this.dep = new Dep()
    // 定义一个内部属性 代表已经是响应式数据 并且指向了它的observer实例
    Object.defineProperty(value,'__ob__',{
      enumerable:false,
      configurable:true,
      value:this

    })
    if(Array.isArray(value)){
        value.__proto__ = newArrayMethods
        this.observeArray(value)
    }else{
      this.walk(value)
    }
   
  }
  observeArray(value){
    value.forEach(item=>{
      observe(item)
    })
    
  }
  walk(data){
    let keys = Object.keys(data)
    keys.forEach(key=>{
      defineReactive(data,key,data[key])
    })
  }
}

function defineReactive(data,key,value){
  const childDep = observe(value)
  let dep = new Dep()
  Object.defineProperty(data,key,{
    get(){
      //当页面取值时 说明用于渲染 需要收集依赖 
      if(Dep.target){
        //有值 说明正在渲染 
        dep.depend()
        if(childDep){
          //给数组增加了dep
          childDep.depend();
        }
      }
      return value
    },
     set(newValue){
      if(newValue === value)return;
      observe(newValue)

      value = newValue
      //触发更新
      dep.notify()
    }
  })

}

export function observe(){

  if(typeof data !=='object' || data ===null){
    return 
  }
  if(data.__ob__) return // 已经观测过
  return new Observer(data)

}