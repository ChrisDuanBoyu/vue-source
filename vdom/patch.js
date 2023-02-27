export function patch(oldEl,vnode){

    if(!oldVnode){
        // 组件的情况
        return createElm(vnode)
    }
    // 计算差异的方法
    if(oldEl.nodeType ===1){
        // 真实节点
        let el = createElm(vnode)
        let parentElm =oldEl.parentNode;
        parentElm.insertBefore(el,oldEl.nextSibling)
        parentElm.removeChild(oldEl)
        return el
    }else{
       /**
        * 比较两个元素的标签 不一样就直接替换掉
        * 文本的虚拟节点tag都是undefined
        * 
        */
       if(oldVnode.tag !==vnode.tag){
        return  oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode)
       }
       if(!oldVnode.tag){
         //文本节点的比对
         if(oldVnode.text !== vnode.text){
          oldVnode.el.textContent = vnode.text
          return oldVnode
         }
       }
       //标签一样 开始比对标签的属性和儿子 同时可以复用节点
       let el = vnode.el = oldVnode.el // 复用节点 
       // 用新的虚拟节点和老的虚拟节点作比对 
       updateProperties(vnode,oldVnode.data)
       //比较完属性比较儿子
       updateChildren(oldVnode,vnode,el)
       
      
       let oldChildren = oldVnode.children || [];
       let newChildren = vnode.children ||[];
       if(oldChildren.length >0 && newChildren.length >0){
            // 老的和新的都有儿子

       }else if(oldChildren.length > 0){
        // 老的有儿子 新的没儿子 直接清空
            el.innerHTML = ''
       }else if(newChildren.length >0){
        for(let i =0;i<newChildren.length;i++){
             // 老的没儿子 新的有儿子 遍历生成子节点的真实节点
            let child = newChildren[i]
            el.appendChild(createElm(child))
        }
       }

    }
    
    

}




function createComponent(vnode){
    let  i  = vnode.data
    if((i =i.hook) && (i =i.init)){
        i(vnode) //内部会new组件 并且生成真实DOM 

    }
    return !!vnode.componentInstance
     
}
function createElm(vnode){
    //创建真实DOM
    let {tag,children,key,data,text} = vnode
    if(typeof tag ==='string'){
    if(createComponent(vnode)){
        return vnode.componentInstance.$el //组件对应的dom元素
    }
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child=>{
        vnode.el.appendChild(createElm(child))
    })
}else{
    vnode.el = document.createTextNode(text)
}
    return vnode.el
}



function isSameVnode(oldVnode,newVnode){
    return oldVnode/tag === newVnode.tag &&oldVnode.key===newVnode.key
}
//子节点的比较
function updateChildren(oldChildren,newChildren,parent){
    //Vue中的算法做了很多优化 dom有很多常见的逻辑 把节点插入到当前的子节点头部 尾部 倒序
    // vue2 采用双指针的方式
    //在尾部添加
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length -1;
    let oldEnVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0;
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length -1;
    let newEndVnode = newChildren[oldEndIndex]

    while(oldStartIndex <= oldEndIndex && newStartIndex<=newEndIndex){
        //比较谁先循环结束
       if(isSameVnode(oldStartVnode,newStartVnode)){
            patch(oldStartVnode,newStartVnode) // 更新属性再去递归更新子节点
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
       }else if(isSameVnode(oldEnVnode,newEndVnode)){
            // 从末尾开始比较
            patch(oldEnVnode,newEndVnode)
            //此时需要倒序遍历
            oldEnVnode = oldChildren[--oldEndIndex] 
            newEndVnode = newChildren[--newEndIndex]

       }
       
}


    if(newStartIndex <= newEndIndex){
        for(let i = newStartIndex;i<newEndIndex;i++){
            //parent.appendChild(createElm(newChildren[i]))
            let ele = newChildren[newEndIndex + 1] ===null?null:newChildren[newEndIndex+1].el
            parent.insertBefore(createElm(newChildren[i],ele))
            
        }
    }
}

function updateProperties(vnode,oldProps ={}){
    
    // 老的有 新的没有 删除属性
    //新的有  用新的

    let el  =vnode.el;
    let newProps = vnode.data || {}; //新属性
    for(let key in oldProps){
        if(!newProps[key]){
            // 新的没有 直接删除
            el.removeAttribute(key)
        }
    }
    let newStyle = newProps.style ||{};
    let oldStyle = oldProps.style||{}

    for(let key in oldStyle){
        if(!newStyle[key]){
            el[style] = ''
        }
    }
    //其他全部用新的覆盖就可以
    for(let key  in newProps){
        if(key ==='style'){
            for(let styleName in newProps.style){
                el.style[styleName] = newProps.style[styleName]
            }
            if(key === 'class'){
                el.className = newProps[key]
            }
        }
        el.setAttribute(key,newProps[key])
    }
}