## `lowleveljs`是一个简单的js代码混淆工具

#### 原理步骤：

1. 使用`@babel/parser`解析出js代码的语法树
2. 把所有的功能语句编译成最基础的操作指令列表
3. 编写解释器来运行这些基础操作指令

#### 使用方法：

1. 全局安装：npm i lowleveljs -g

#### 命令行功能：

1. 创建test.js，内容如下：
  ```
  console.log(process.argv)
  ```

2. 编译js代码（目前最高支持到es5语法）

    lljs --compile-es5 test.js --out test.bin --mask 123

    参数说明：

    **--compile-es5** 指定需要编译的文件名。【必填】

    **--out** 指定编译结果的输出文件名。【必填】

    **--mask** 设置掩码，此项【可不填】，默认会随机从0-255之间取一个整数作为掩码。掩码仅用于去除编译结果的特征，不要试图使用掩码作为加密工具

3. 运行编译后的文件

    lljs --run test.bin --mask 123 --params xx yy

    **--run** 指定需要运行的文件名

    **--mask** 同上，此项和编译时填的需要保持一致

    **--params** 此项仅搭配--run使用才有效，如果设置了--params则test.bin运行时获取到的process.argv会被替换为 `$NODE_PATH test.bin xx yy`

#### 保护部分代码：

1. 在项目目录安装 lowleveljs

    npm i lowleveljs

2. 假设需要保护的代码文件为test.js，内容如下：

  ```
  shared.G=function(){
    return A*B
  }
  ```

3. 编译test.js生成test.bin

    lljs --compile-es5 test.js --out test.bin

4. 在项目代码中使用test.bin

  ```
  const {run}=require('lowleveljs')
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

  // 浏览器环境则【参数2】传Uint8Array

  console.log(bindVars.shared.G())
  ```

5. 更多用法见test下的文件夹

#### lowleveljs模块暴露方法

1. compile(maskstr: String, sourceCode: String)
  示例：
  ```
  const sourceCode=`console.log(11)`
  const maskstr='123'
  const {compile}=require('lowleveljs')
  const {BIN}=compile(maskstr, sourceCode)
  require('fs').writeFileSync('xx.bin', BIN)
  ```

2. run(maskstr: String, file: String | Object | Uint8Array | Buffer [, bindVars: Object])
  示例：
  ```
  const maskstr='123'
  const {compile}=require('lowleveljs')
  run(maskstr, 'xx.bin')
  ```

3. require_lljs(同run方法的参数)

```
  // 以下两句代码等效
  a=require_lljs(...)
  a=run(...).module.exports
  ```

---

### 已知问题：

1. 我使用白名单方式编译语法，因此如果我没遇到过的表达式场景肯定会抛异常

2. 特定场景生成的指令可能有问题

3. 明确不支持eval, with, arguments.callee, arguments.caller

4. 使用问题可抛到：https://github.com/treemonster/lowleveljs/issues
