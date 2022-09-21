// file参数支持三种类型：
// 1. content: Uint8Array/Buffer
// 2. Object{ content: Uint8Array/Buffer, filename: String }
// 3. filename: String
function run(maskstr, file, bindVars) {
  let _bin, _filename
  let isNode=typeof window==='undefined'
  if(typeof file==='string' && isNode) {
    _filename=file
    _bin=require('fs').readFileSync(file)
  }else if(file.constructor===Uint8Array || file.constructor===Array || (isNode && file.constructor===Buffer)) {
    _bin=file
  }else if(file.constructor===Object) {
    const {content, filename}=file
    _bin=content
    _filename=filename
  }

  if(!_bin) {
    throw new Error('no content input')
  }

  const top=isNode? (gg=>{
    const path=require('path')
    const workdir=process.cwd()
    if(!_filename) {
      _filename=path.resolve(workdir+'/index.js')
    }
    const _fn=path.resolve(_filename)
    const _dir=path.parse(_fn).dir
    const exports={}, module={exports}
    return Object.assign(gg, {
      __filename: _fn,
      __dirname: _dir,
      require: fn=>{
        return require(require.resolve(fn, {
          paths: [workdir, _dir],
        }))
      },
      exports, module,
    })
  })(global): window
  const runner=require(__dirname+'/libs/vm')
  runner([_bin], bindVars, top, maskstr && (new TextEncoder).encode(maskstr))
  return top
}

exports.run=run
exports.compile=(maskstr, code)=>{
  const compile=require(__dirname+'/libs/compiler')
  return compile(code, maskstr && (new TextEncoder).encode(maskstr))
}
exports.require_lljs=(...argv)=>{
  return run(...argv).module.exports
}

// _compile(code, {repVars: 'T_', transform: 1, uglifyjs: 1, mask: 'xxx'})
exports._compile=(sourceCode, opts)=>{
  let steps={}
  if(opts.repVars) {
    console.log('正在替换`'+opts.repVars+'`开头的变量..')
    let T_vals={}, T_valsI=Date.now()%1e3
    sourceCode=sourceCode.replace(new RegExp('\\b'+opts.repVars+'[a-z\\d_$]+\\b', 'ig'), a=>{
      if(T_vals[a]) return T_vals[a]
      T_valsI+=Math.random()*9+1|1
      T_vals[a]=opts.repVars+T_valsI.toString(36)
      return T_vals[a]
    })
    steps._afterRepVals=sourceCode
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
    steps._afterTransfrom=sourceCode
  }
  if(opts.uglifyjs) {
    console.log('正在使用uglifyjs混淆代码..')
    const UglifyJS=require("uglify-js")
    sourceCode=UglifyJS.minify('(function() {\n'+sourceCode+'\n})()', {
      output: {
        beautify: opts.min? false: true,
      },
    }).code
    steps._afterUglifyjs=sourceCode
  }
  const Ret=exports.compile(opts.mask, sourceCode)
  Object.assign(Ret, steps)
  return Ret
}
