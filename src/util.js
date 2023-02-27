export function proxy(vm,data,key){
  Object.defineProperty(vm,key,{
   get(){
     return vm[data][key]
   },
   set(newValue){
       vm[data][key] = newValue
   }
  })
 }


 export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
 ]


const strats ={}
// 合并组件的策略 
strates.components =function(parentVal,childVal){
  const res = Object.create(parentVal) // 利用原型的就近
  if(childVal){
    for(let key in childVal){
      res[key] = childVal[key]
    }
  } 
}
strats.data = function(){
  //合并data策略
}

strates.computed =function(){}
strates.watch = function(){}

function mergeHook(parentVal,childVaL) {
  //生命周期的策略
  if(childVal){
      if(parentVal){
       return parentVal.concat(childVaL)
      }else{
        return [childVaL]
      }

  }else{
    return parentVal  // 不合并
  }

  
}

LIFECYCLE_HOOKS.forEach((hook)=>{
  // 所有生命周期采用相同的策略
  strates[hook] = mergeHook
})

 export function mergeOptions(parent,child){
  const options ={}
  for(let key in parent){
    mergeField(key)
  }

  for(let key in child){
  if(!parent.hasOwnProperty(key))
      mergeField(key)
  }

  

  function mergeField(key){
    
    // 根据key的采取不同的策略来合并
    if(strates[key]){
      options[key] = strates[key](parent[key],child[key])
    }else{
      //默认合并
      options[key] =child[key]
    }
  
 }
} 


let callbacks = []


function flushCallbacks(){
  callbacks.forEach(cb=>cb())
  pending = false
  callbacks =[]
}

let pending = false
export function nextTick(cb){
  callbacks.push(cb)  
  if(!pending){
    Promise.resolve().then(flushCallbacks)
    pending =true
  }


}





function makeMap(str){

  const map = {}
  const list = str.split(',');
  list.forEach(item=>{
    map[item] = true
  })
  return (key)=>{
    return map[key]
  }

}




export const isReservedTag =makeMap(
  'a','div','image' //  原生标签
)