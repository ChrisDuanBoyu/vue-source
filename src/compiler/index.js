export function compileToFunctions(template){
  // html模板 => render函数 使用AST  
    let ast = parseHTML(template);
    let code =generate(ast)
    let render = new Function(`with(this){return ${code}}`)
}

function parseHTML(html){
    //转换成AST
}

function generate(){
    // 生成render函数的代码
}