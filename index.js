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
  }else if(file.constructor===Uint8Array || (isNode && file.constructor===Buffer)) {
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
