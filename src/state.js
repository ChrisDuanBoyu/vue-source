import { observe } from "./observer/index"
import {proxy} from './util'
export function initState(vm){
  vm.$options.data && initData(vm)
  vm.$options.Props && initProps(vm)
  vm.$options.methods && initMethods(vm)
  vm.$options.computed && initComputed(vm)
  vm.$options.initWatch && initWatch(vm)
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

function initComputed(){}
function initWatch(){}