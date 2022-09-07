const {compile, run}=require(__dirname+'/../..')
const maskstr=0
const bindVars={
  A: 2,
  B: 3,
  shared: {}, // 共享对象可实现内外交互
}
const code=`
shared.G=function(){
  return A*B
}`
const {BIN, GVARS}=compile(maskstr, code)
console.log('检测到的全局变量：', GVARS)
console.log('编译结果：', BIN)
run(maskstr, BIN, bindVars)
console.log(bindVars.shared.G())
