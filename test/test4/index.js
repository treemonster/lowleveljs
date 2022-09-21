const fs=require('fs')
const {compile, _compile, run}=require(__dirname+'/../..')
const maskstr=0
/*
const {TXT, MEM, GVARS, SEQ, BIN, _afterUglifyjs}=_compile(fs.readFileSync(__dirname+'/code.js', 'utf8'), {
  repVars: 'T_',
  transform: 1,
  uglifyjs: 1,
  mask: maskstr,
})
fs.writeFileSync(__dirname+'/code.raw.js', _afterUglifyjs)
*/
// const {TXT, MEM, GVARS, SEQ, BIN}=compile(maskstr, fs.readFileSync(__dirname+'/code.raw.js', 'utf8'))
const {TXT, MEM, GVARS, SEQ, BIN}=compile(maskstr, fs.readFileSync(__dirname+'/code.js', 'utf8'))

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
run(maskstr, BIN)
