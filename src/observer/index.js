import {newArrayMethods} from './array'

class Observer {
  constructor(value){
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
  observe(value)
  Object.defineProperty(data,key,{
    get(){
      return value
    },
     set(newValue){
      if(newValue === value)return;
      observe(newValue)
      value = newValue
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