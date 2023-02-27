import { nextTick } from "../util";
import { popTarget, pushTarget } from "./dep";

let id = 0;
class Watcher{
    constructor(vm,exprOrFn,cb,options){
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.options = options
        this.id = id++
        this.deps = []
        this.isWatcher =typeof options ==='boolean' // 标识是否是渲染watcher
        this.user = !!options.user  // 标识是否是用户 watcher
        this.lazy = options.lazy; //取值是是否执行用户逻辑
        this.dirty = this.lazy
        this.depIds = new Set()
        if(typeof exprOrFn =='function'){
            this.getter =exprOrFn
        }else{

            this.getter =function(){
                let path = exprOrFn.split('.')
                let obj = vm;
                for(let i =0;i<path.length;i++){
                    obj = obj[path[i]]
                }
                return obj
            }
        }

        // 进行依赖收集 
         this.value = this.lazy?void 0: this.get()
    }

    evaluate(){
      this.value = this.get()
      this.dirty = false //
    }
    get(){
        pushTarget(this)
        let result = this.getter().call(this.vm)
        popTarget()
        return result
    }
    depend(){
        // 计算属性watcher 会存dep
        let i = this.deps.length;
        while(i--){
            this.deps[i].depend()
        }
    }
    update(){
      if(!this.lazy){
        this.dirty = true // 再取值就是最新的了
      }else{
        //重新渲染 但是不能每次都调用 所以需要加入队列
        queueWatcher(this)
      }
        
     
    }

    addDep(dep){
        if(!this.depIds.has(dep.id)){
            this.deps.push(dep);
            this.depIds.add(dep.id)
            dep.addSub(this)
        }
       
    }
    run(){
        // 真正的渲染逻辑
       let newValue= this.get()
       let oldValue =this.value;
       if(this.user){
        this.cb.call(this.vm,newValue,oldValue)
       }
    }
}


let queue = []
let has ={};
let pending = false // 标识是否有待处理的watcher


// 批处理
function flushSchedulerQueue(){
    queue.forEach(watcher=>{
        
        watcher.run()
        if(!watcher.isWatcher) return 
        watcher.cb()
    })
    queue =[]// 处理完一轮需要清空
    has = {}
    pending = false
}
function queueWatcher(watcher){
    if(has[watcher.id] ===null){ //去重操作
        queue.push(watcher)
        has[watcher.id] = true
    }
    if(!pending){ 
        nextTick(flushSchedulerQueue)
        pending = true
    }
  
}


export default Watcher