
let id =0;
class Dep{
    constructor(){
        this.subs =[]
        this.id= id++
    }
    depend(){
        //存储一个watcher
        Dep.target.addDep(this)
        
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        //调用watcher开始渲染
        this.subs.forEach(watcher=>watcher.update())
    }
}




Dep.target =null
let stack = [];
export function pushTarget(target){
    Dep.target=target // 保存watcher
    stack.push(watcher) //
}


export function popTarget(){
    stack.pop()
    Dep.target = stack[stack.length-1]
}
export default Dep

// 多对多的关系 一个属性有一个dep用来收集watcher
// dep可以存多个watcher
// 一个watcher可以存多个dep