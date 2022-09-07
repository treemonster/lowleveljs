const {run, require_lljs}=require('../../')
const maskstr=0
const bindVars={
  A: 2,
  B: 3,
  shared: {}, // 共享对象可实现内外交互
}
// node环境下以下语句等效
/*
 run(maskstr, {
   content: require('fs').readFileSync('test.bin'),
   filename: 'test.bin',
 }, bindVars)
 */
run(maskstr, 'test.bin', bindVars)

// 浏览器环境则参数2传Uint8Array

console.log(bindVars.shared.G())

// 可以使用require_lljs这个方法来引用一个编译后的nodejs模块
const addMod=require_lljs(maskstr, 'addmod.bin')
const subMod=require_lljs(maskstr, 'submod.bin')
console.log(addMod(4, 9), subMod.subFunc(10, 3))
