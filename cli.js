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
  if(p[i]==='--compile-es5') opts.compileEs5Filename=p[++i]
  if(p[i]==='--out') opts.out=p[++i]
  if(p[i]==='--params') {
    const node=process.argv[0]
    process.argv.splice(0, i+3)
    process.argv.unshift(node, opts.run)
    break
  }
}

const fl=(...a)=>require('fs').readFileSync(...a)
const {compile, run}=require(__dirname)
if(opts.run) {
  run(opts.mask, opts.run)
}else if(opts.compileEs5Filename) {
  if(!opts.out) {
    console.log('必须指定输出文件名：--out 文件名')
    process.exit(1)
  }
  const {TXT, MEM, GVARS, SEQ, BIN}=compile(opts.mask, fl(opts.compileEs5Filename, 'utf8'))
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
