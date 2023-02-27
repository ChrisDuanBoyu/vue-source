const oldArrayMethods = Array.prototype

export const newArrayMethods = Object.create(oldArrayMethods)


const methods = [
  'push',
  'sort',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse'
]


methods.forEach(method=>{
  newArrayMethods[method] = function(...args){
    let inserted;
    switch(method){
      case 'push':
      case 'unshift':
        inserted = args;
      case 'splice':
        inserted = args.slice(2)
    }
    if(inserted){
      //新增的元素也需要观测
      this.__ob__.observeArray(inserted)
    }
    //数组的通知更新
    ob.dep.notify()
   return oldArrayMethods[method].call(this,...args)
  }
})