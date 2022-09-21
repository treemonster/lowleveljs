#!/usr/bin/env node

// lljs --mask 123456 --compile-es5 test.js --out test.bin
// lljs --mask 123456 --run test.bin

const p=process.argv.slice(2)
let opts={}
for(let i=0; i<p.length; i++) {
  if(p[i]==='--version') {
    console.log('version: '+require(__dirname+'/package.json').version)
    process.exit()
  }
  if(p[i]==='--mask') opts.mask=p[++i]
  if(p[i]==='--run') opts.run=p[++i]
  if(p[i]==='--compile-es5') opts.compileFilename=p[++i]
  if(p[i]==='--out') opts.out=p[++i]
  if(p[i]==='--params') {
    const node=process.argv[0]
    process.argv.splice(0, i+3)
    process.argv.unshift(node, opts.run)
    break
  }

  // 以下为实验参数，不展示在README.md中
  // * 1. 特定前缀表达式转换为随机变量名字
  if(p[i]==='--replace-prefix') opts.repVars=p[++i]
  // * 2. 文件内容读取之后，先转换成es5语法
  if(p[i]==='--transform') opts.transform=1
  // * 3. 使用uglifyjs混淆源码
  if(p[i]==='--use-uglifyjs') opts.uglifyjs=1
}

const fl=(...a)=>require('fs').readFileSync(...a)
const {compile, run, _compile}=require(__dirname)
if(opts.run) {
  run(opts.mask, opts.run)
}else if(opts.compileFilename) {
  if(!opts.out) {
    console.log('必须指定输出文件名：--out 文件名')
    process.exit(1)
  }
  let sourceCode=fl(opts.compileFilename, 'utf8')
  /*
  if(opts.repVars) {
    console.log('正在替换`'+opts.repVars+'`开头的变量..')
    let T_vals={}, T_valsI=Date.now()%1e3
    sourceCode=sourceCode.replace(new RegExp('\\b'+opts.repVars+'[a-z\\d_$]+\\b', 'ig'), a=>{
      if(T_vals[a]) return T_vals[a]
      T_valsI+=Math.random()*9+1|1
      T_vals[a]=opts.repVars+T_valsI.toString(36)
      return T_vals[a]
    })
    console.log(`替换结果：`)
    console.log(T_vals)
  }
  if(opts.transform) {
    console.log('正在转换为es5语法，并添加polyfill..')
    const brc={
      "plugins": ["@babel/plugin-transform-async-to-generator"],
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "entry",
            "corejs": 2
          }
        ]
      ]
    }
    sourceCode=require('@babel/core').transform(sourceCode, brc).code
  }
  if(opts.uglifyjs) {
    console.log('正在使用uglifyjs混淆代码..')
    const UglifyJS=require("uglify-js")
    sourceCode=UglifyJS.minify('(function() {\n'+sourceCode+'\n})()').code
  }
  const {TXT, MEM, GVARS, SEQ, BIN}=compile(opts.mask, sourceCode)
  */
  const {TXT, MEM, GVARS, SEQ, BIN}=_compile(sourceCode, opts)
  console.log('预编译结果 <数字(表示MEM的下标，或者该指令的特殊用法) 和 变量名称>：')
  console.log(TXT)
  console.log('='.repeat(32))
  console.log('内存常量:')
  console.log(MEM)
  console.log('='.repeat(32))
  console.log('全局变量:')
  console.log(GVARS)
  console.log('='.repeat(32))
  console.log('打包后的结果：')
  console.log(BIN)
  console.log('='.repeat(32))
  require('fs').writeFileSync(opts.out, Buffer.from(BIN))
  console.log('保存完成')
}else{
  console.log('不支持此用法，请查看README.md')
  process.exit()
}
