
const {CMDLS, NotSupport, mask, CMDLS_BIN_ext, CMDLS_FLOW_ext, CMDLS_SIG_ext, ARR_typ}=require('./common')
const [VAR, FUNC, FVAR, MOV, BIN, IF, ARR, CAL, TRY, FOR, FLOW, ATTR, OBJ, SWITCH, SIG, COPY, FARGU, LOG]=CMDLS
const [LGR, LSR, EQU, ADD, MULTI, SUB, DIV, AND, SEQU, SNEQU, OR, INSTANCEOF, IN, MOD, LSRE, LGRE, NEQU, BIT_MOV_LEFT, BIT_MOV_RIGHT, XOR, BIT_AND, BIT_OR, NO_SYMBOL_MOV_RIGHT]=CMDLS_BIN_ext
const [RET, THROW, BREAK, CONTINUE]=CMDLS_FLOW_ext
const [UNARY, TYPEOF, VOID, DELETE, INIT_THIS, BIT_NEGATE]=CMDLS_SIG_ext
const [ARR_ARRAY, ARR_MEMBER]=ARR_typ

// 类别枚举参考文档 https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#programs

const CMDLS_map='VAR, FUNC, FVAR, MOV, BIN, IF, ARR, CAL, TRY, FOR, FLOW, ATTR, OBJ, SWITCH, SIG, COPY, FARGU, LOG'.split(/\s*,\s*/).reduce((a, b, i)=>{
  a[b]=CMDLS[i]
  return a
}, {})

let globalContextVars={}

function pack(maskarr, OUT4, MEM) {
  let OUT5=[OUT4.length]
  for(let i=0; i<OUT4.length; i++) {
    OUT5.push(OUT4[i].length)
    OUT5.push(...OUT4[i])
  }
  const mem=JSON.stringify([MEM, (x=>{
    let ret=[]
    for(let k in x) ret.push(parseInt(k), x[k])
    return ret
  })(globalContextVars)]).split('').map(a=>a.charCodeAt(0))
  OUT5.push(mem.length)
  OUT5.push(...mem)

  let OUT6=[]
  for(let i=0; i<OUT5.length; i++) {
    if(!OUT5[i]) OUT6.push(0, 0, 0)
    else if(OUT5[i]>255) {
      OUT6.push(0, 0)
      let o=[], n=0xff+1
      for(let p=OUT5[i]; p>0; ) {
        o.unshift(p%n)
        p=(p-p%n)/n
      }
      OUT6.push(o.length, ...o)
    }else{
      OUT6.push(OUT5[i])
    }
  }

  return mask(maskarr, OUT6)
  /*
  const mask=Math.round(0xff*Math.random())
  return [mask, ...OUT6.map((a, i)=>a^((mask+i)%0xff))]
  */

}

// const a=idxMapper()
// a.getIdxOf(obj) // 返回下标数字
function idxMapper(o=0) {
  let arr=[]
  let map=new Map
  return {
    getIdxOf: v=>{
      if(map.has(v)) return map.get(v)
      let m=arr.length+o
      map.set(v, m)
      arr.push(v)
      return m
    },
    getMap: _=>map,
    getArr: _=>arr,
  }
}

let ri=0
function rndstr() {
  return (Math.random()+Date.now()).toString(36)+'_'+(ri++)
}

function find_val(contexts, val) {
  // contexts[0]是特殊全局变量，不作为作用域
  for(let j=contexts.length; j-->1; ) {
    if(!contexts[j][val]) continue
    return contexts[j][val]
  }
}

function test_val(contexts, name) {
  if(find_val(contexts, name)!==name) {
    contexts[0][name]=name
  }
  return name
}


let _var_i=0, mvPrefix=rndstr(), cacheVars=[]
function mallocVar() {
  if(!cacheVars.length) {
    for(;cacheVars.length<1e3;) {
      let v=mvPrefix+(_var_i++).toString(36)
      cacheVars.push(v)
    }
    cacheVars.sort(_=>Math.random()-.5)
  }
  return cacheVars.pop()
}

let OUT=[]
const MEM_idxMapper=idxMapper() // 存放常值

function scanVariable(Node, context) {
  if(Node.type==='VariableDeclaration') {
    Node.declarations.map(({id, init})=>{
      context[id.name]=id.name
    })
  }else if(Node.type==='FunctionDeclaration') {
    context[Node.id.name]=Node.id.name
  }
}

function parseNodeList(Node, contexts, ctx) {
  if(!contexts) {
    contexts=[{}, {}]
  }
  if(!ctx) {
    ctx=contexts[contexts.length-1]
    OUT.push({type: 'ctx', value: ctx})
    ctx['this']='this'
    OUT.push(`SIG this, ${INIT_THIS}, this`)
  }

  // 变量和function提升
  for(let i=0; i<3; i++) {
    Node.body.map(Node=>{
      if(i===0) {
        scanVariable(Node, ctx)
      }else if(i===1) {
        if(Node.type==='FunctionDeclaration') {
          parseFunctionDeclaration(Node, contexts)
        }
      }else{
        if(Node.type==='IfStatement') parseIfStatement(Node, contexts)
        else if(Node.type==='VariableDeclaration') parseVariableDeclaration(Node, contexts)
        else if(Node.type==='ReturnStatement') parseReturnStatement(Node, contexts)
        else if(Node.type==='ExpressionStatement') parseExpressionStatement(Node, contexts)
        else if(Node.type==='TryStatement') parseTryStatement(Node, contexts)
        else if(Node.type==='ThrowStatement') parseThrowStatement(Node, contexts)
        else if(Node.type==='ForStatement') parseForStatement(Node, contexts)
        else if(Node.type==='BreakStatement') parseBreakStatement(Node, contexts)
        else if(Node.type==='ContinueStatement') parseContinueStatement(Node, contexts)
        else if(Node.type==='SwitchStatement') parseSwitchStatement(Node, contexts)
        else if(Node.type==='ForInStatement') parseForInStatement(Node, contexts)
        else if(Node.type==='BlockStatement') parseNodeList(Node, contexts, ctx)
        else if(Node.type==='WhileStatement') parseWhileStatement(Node, contexts)
        else if(Node.type==='EmptyStatement') ;
        else if(Node.type!=='FunctionDeclaration') {
          NotSupport(Node)
        }
      }
    })
  }

  return contexts
}
function parseSwitchStatement(Node, contexts) {
  const ctx=contexts[contexts.length-1]
  const {discriminant, cases}=Node
  let switch_flag=rndstr()
  let jv=parseSideValue(discriminant, contexts)
  OUT.push({type: 'switch', value: {switch_flag, jv}})
  cases.map(Node=>{
    if(Node.type==='SwitchCase') {
      const {test, consequent}=Node
      let caseVal
      if(test===null) {
        caseVal=jv
      }else{
        caseVal=parseSideValue(test, contexts)
      }
      OUT.push({type: 'switch', value: {switch_flag, caseVal}, extra: 'endcompare'})
      parseNodeList({body: consequent}, contexts, ctx)
      OUT.push({type: 'switch', value: {switch_flag}, extra: 'endcase'})
    }else{
      NotSupport(Node)
    }
  })
}

function parseFunctionDeclaration(Node, contexts, isClosure, closureRetVal) {
  if(isClosure && !closureRetVal) {
    NotSupport({
      message: 'isClosure时，必须传入闭包指针'
    })
  }
  function _parse() {
    const ctx2={}
    const {id, params, body}=Node
    const fn=id.name
    contexts[contexts.length-1][fn]=fn
    const func_flag=rndstr()
    OUT.push({type: 'func', value: {ctx: ctx2, refFn: fn, func_flag}})
    let fvar_ls=[]
    params.map((a, i)=>{
      ctx2[a.name]=a.name
      fvar_ls.push(a.name)
    })
    if(fvar_ls.length) {
      OUT.push(`FVAR ${[...fvar_ls].join(', ')}`)
    }
    ctx2['arguments']='arguments'
    ctx2['this']='this'
    OUT.push(`FARGU arguments, this`)
    parseNodeList(body, contexts.concat([ctx2]), ctx2)
    OUT.push(`FLOW ${RET}`)
    OUT.push({type: 'func', value: {func_flag}, extra: 'end_func'})
  }
  if(!isClosure) {
    _parse()
    return
  }
  contexts[contexts.length-1][closureRetVal]=closureRetVal
  const ctx3={}
  const fn=Node.id.name
  ctx3[fn]=fn
  contexts=contexts.concat([ctx3])
  const func_flag=rndstr()
  OUT.push({type: 'func', value: {ctx: ctx3, refFn: closureRetVal, func_flag}})
  _parse()
  OUT.push(`FLOW ${RET}, ${fn}`)
  OUT.push({type: 'func', value: {func_flag}, extra: 'end_func'})
  OUT.push(`CAL 0, ${closureRetVal}, ${closureRetVal}, ${MEM_idxMapper.getIdxOf(0)}`)
}


function parseBreakStatement(Node, contexts) {
  OUT.push(`FLOW ${BREAK}`)
}
function parseContinueStatement(Node, contexts) {
  OUT.push(`FLOW ${CONTINUE}`)
}
function parseConditionalExpression(Node, contexts, retVal) {
  parseIfStatement(Node, contexts, retVal)
}
function parseIfStatement(Node, contexts, retVal) {
  const {test, consequent, alternate}=Node
  let jv=parseSideValue(test, contexts)
  let if_flag=rndstr()
  OUT.push({type: 'if', value: {if_flag, jv}})
  if(consequent) {
    let rv=parseSideValue(consequent, contexts, !retVal)
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${rv}`)
    }
  }
  OUT.push({type: 'if', value: {if_flag}, extra: 'else'})
  if(alternate) {
    let rv=parseSideValue(alternate, contexts, !retVal)
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${rv}`)
    }
  }
  OUT.push({type: 'if', value: {if_flag}, extra: 'endif'})
}
function parseForInStatement(Node, contexts) {
  parseForStatement(Node, contexts)
}
function parseWhileStatement(Node, contexts) {
  parseForStatement(Node, contexts)
}

function parseSideValue(Node, contexts, noRetVal, opts={}) {
  let retVal=noRetVal? 0: mallocVar()
  const ctx=contexts[contexts.length-1]
  if(Node.type==='UpdateExpression') {
    parseUpdateExpression(Node, contexts, retVal)
  }else if(Node.type==='VariableDeclaration') {
    scanVariable(Node, ctx)
    parseVariableDeclaration(Node, contexts)
  }else if(Node.type==='AssignmentExpression') {
    retVal=parseAssignmentExpression(Node, contexts)
  }else if(Node.type==='NumericLiteral') {
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${MEM_idxMapper.getIdxOf(Node.value)}`)
    }
  }else if(Node.type==='ObjectExpression') {
    parseObjectExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='CallExpression') {
    parseCallExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='MemberExpression') {
    parseMemberExpression(Node, contexts, retVal || mallocVar())
    if(retVal && !opts.noAttr) OUT.push(`ATTR ${retVal}`)
  }else if(Node.type==='FunctionExpression') {
    parseFunctionExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='BinaryExpression') {
    parseBinaryExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='LogicalExpression') {
    parseLogicalExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='UnaryExpression') {
    parseUnaryExpression(Node, contexts, retVal)
  }else if(Node.type==='NewExpression') {
    parseNewExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='BooleanLiteral') {
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${MEM_idxMapper.getIdxOf(Node.value)}`)
    }
  }else if(Node.type==='Identifier') {
    retVal=test_val(contexts, Node.name)
  }else if(Node.type==='ConditionalExpression') {
    parseConditionalExpression(Node, contexts, retVal)
  }else if(Node.type==='ArrayExpression') {
    parseArrayExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='StringLiteral') {
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${MEM_idxMapper.getIdxOf(Node.value)}`)
    }
  }else if(Node.type==='SequenceExpression') {
    parseSequenceExpression(Node, contexts, retVal || mallocVar())
  }else if(Node.type==='ThisExpression') {
    if(retVal) {
      OUT.push(`MOV ${retVal}, this`)
    }
  }else if(Node.type==='ContinueStatement') {
    parseContinueStatement(Node, contexts)
  }else if(Node.type==='BreakStatement') {
    parseBreakStatement(Node, contexts)
  }else if(Node.type==='ThrowStatement') {
    parseThrowStatement(Node, contexts)
  }else if(Node.type==='BlockStatement') {
    parseNodeList(Node, contexts, ctx)
  }else if(Node.type==='ReturnStatement') {
    parseReturnStatement(Node, contexts)
  }else if(Node.type==='IfStatement') {
    parseIfStatement(Node, contexts, retVal)
  }else if(Node.type==='ExpressionStatement') {
    parseExpressionStatement(Node, contexts)
  }else if(Node.type==='ForInStatement') {
    parseForInStatement(Node, contexts)
  }else if(Node.type==='RegExpLiteral') {
    parseRegExpLiteral(Node, contexts, retVal)
  }else if(Node.type==='EmptyStatement') {
    // EmptyStatement 什么都不做
  }else if(Node.type==='SwitchStatement') {
    parseSwitchStatement(Node, contexts)
  }else if(Node.type==='NullLiteral') {
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${MEM_idxMapper.getIdxOf(null)}`)
    }
  }else if(Node.type==='ForStatement') {
    parseForStatement(Node, contexts)
  }else if(Node.type==='TryStatement') {
    parseTryStatement(Node, contexts)
  }else{
    NotSupport(Node)
  }
  return retVal
}


function parseForStatement(Node, contexts) {
  /**
   for循环没有自己的ctx，init变量和外层的同级，内部的也是和外层变量同级
   */
  // const ctx=contexts[contexts.length-1]
  const {
    type,
    init, test, update,
    left, right,
    body,
  }=Node

  const fortestval=mallocVar()
  const for_flag=rndstr()
  let _next=0

  if(type==='ForStatement' || type==='WhileStatement') {
    if(init) {
      parseSideValue(init, contexts, 1)
    }

    OUT.push({type: 'for', value: {for_flag, fortestval}})

    if(!test) {
      OUT.push(`MOV ${fortestval}, ${MEM_idxMapper.getIdxOf(1)}`)
    }else{
      let tv=parseSideValue(test, contexts)
      OUT.push(`MOV ${fortestval}, ${tv}`)
    }
    OUT.push({type: 'for', value: {for_flag}, extra: 'endtest'})

    if(update) {
      parseSideValue(update, contexts, 1)
    }
    OUT.push({type: 'for', value: {for_flag}, extra: 'endupdate'})

  }else if(type==='ForInStatement') {
    /**
    for(k in x) {...}
    等价于
    if(x) {
      for(i=0, ls=Object.keys(x); i<ls.length; i++) {
        k=x[i]
        ...
      }
    }
     */
    let bind_key
    if(left.type==='Identifier') {
      bind_key=test_val(contexts, left.name)
    }else if(left.type==='VariableDeclaration') {
      scanVariable(left, contexts[contexts.length-1])
      parseVariableDeclaration(left, contexts)
      if(left.declarations.length!==1) {
        NotSupport(left)
      }
      bind_key=test_val(contexts, left.declarations[0].id.name)
    }else{
      NotSupport(left)
    }
    let loop_val=parseSideValue(right, contexts)


    let if_flag=rndstr()
    OUT.push({type: 'if', value: {
      if_flag,
      jv: loop_val,
    }})

    _next=_=>{

      OUT.push({type: 'if', value: {
        if_flag,
      }, extra: 'else'})
      OUT.push({type: 'if', value: {
        if_flag,
      }, extra: 'endif'})

    }

    const i=mallocVar(), ls=mallocVar()
    OUT.push(`MOV ${i}, ${MEM_idxMapper.getIdxOf(0)}`)
    let fn=mallocVar(), arg=mallocVar(), key_len=mallocVar()
    OUT.push(`MOV ${fn}, ${MEM_idxMapper.getIdxOf(0)}`)
    OUT.push(`MOV ${arg}, ${MEM_idxMapper.getIdxOf(0)}`)
    OUT.push(`MOV ${key_len}, ${MEM_idxMapper.getIdxOf(0)}`)
    OUT.push(`ARR ${fn}, ${ARR_ARRAY}, ${test_val(contexts, 'Object')}, ${MEM_idxMapper.getIdxOf('keys')}`)
    OUT.push(`ARR ${arg}, ${ARR_ARRAY}, ${loop_val}`)
    OUT.push(`CAL 0, ${ls}, ${fn}, ${arg}`)
    OUT.push(`ARR ${key_len}, ${ARR_MEMBER}, ${ls}, ${MEM_idxMapper.getIdxOf('length')}`)
    OUT.push(`ATTR ${key_len}`)
    OUT.push(`MOV ${bind_key}, ${MEM_idxMapper.getIdxOf(0)}`)

    OUT.push({type: 'for', value: {
      for_flag,
      fortestval,
    }})

    OUT.push(`BIN ${fortestval}, ${LSR}, ${i}, ${key_len}`)

    OUT.push({type: 'for', value: {
      for_flag,
    }, extra: 'endtest'})

    OUT.push(`BIN ${i}, ${ADD}, ${i}, ${MEM_idxMapper.getIdxOf(1)}`)

    OUT.push({type: 'for', value: {
      for_flag,
    }, extra: 'endupdate'})

    OUT.push(`MOV ${bind_key}, ${MEM_idxMapper.getIdxOf(0)}`)
    OUT.push(`ARR ${bind_key}, ${ARR_MEMBER}, ${ls}, ${i}`)
    OUT.push(`ATTR ${bind_key}`)

  }else{
    NotSupport(Node)
  }

  if(body) {
    parseSideValue(body, contexts, 1)
  }
  OUT.push({type: 'for', value: {
    for_flag,
  }, extra: 'endfor'})

  if(_next) _next()

}

function parseSequenceExpression(Node, contexts, ret) {
  const {expressions}=Node
  expressions.map((Node, i)=>{
    let retVal=i===expressions.length-1? ret: undefined
    let rv=parseSideValue(Node, contexts)
    if(retVal) {
      OUT.push(`MOV ${retVal}, ${rv}`)
    }
  })
}
function parseReturnStatement(Node, contexts) {
  const {argument}=Node
  if(!argument) {
    OUT.push(`FLOW ${RET}`)
  }else{
    OUT.push(`FLOW ${RET}, ${parseSideValue(argument, contexts)}`)
  }
}
function parseLogicalExpression(Node, contexts, retVal) {
  parseBinaryExpression(Node, contexts, retVal)
}
function parseFunctionExpression(Node, contexts, retVal) {
  const rv=mallocVar()
  Node.id=Node.id || {name: mallocVar()}
  const closureRetVal=mallocVar()
  parseFunctionDeclaration(Node, contexts, 1, closureRetVal)
  OUT.push(`MOV ${retVal}, ${closureRetVal}`)
}

function parseBinaryExpression(Node, contexts, retVal) {
  const {left, operator, right}=Node
  OUT.push(`MOV ${retVal}, ${parseSideValue(left, contexts)}`)

  let retVal2=mallocVar()
  if(operator==='&&') {
    let if_flag=rndstr()
    OUT.push({type: 'if', value: {
      if_flag,
      jv: retVal,
    }})
    OUT.push(`MOV ${retVal2}, ${parseSideValue(right, contexts)}`)
    OUT.push({type: 'if', value: {
      if_flag,
    }, extra: 'else'})
    OUT.push(`MOV ${retVal2}, ${retVal}`)
    OUT.push({type: 'if', value: {
      if_flag,
    }, extra: 'endif'})
  }else if(operator==='||') {
    let if_flag=rndstr()
    OUT.push({type: 'if', value: {
      if_flag,
      jv: retVal,
    }})
    OUT.push(`MOV ${retVal2}, ${retVal}`)
    OUT.push({type: 'if', value: {
      if_flag,
    }, extra: 'else'})
    OUT.push(`MOV ${retVal2}, ${parseSideValue(right, contexts)}`)
    OUT.push({type: 'if', value: {
      if_flag,
    }, extra: 'endif'})
  }else{
    OUT.push(`MOV ${retVal2}, ${parseSideValue(right, contexts)}`)
  }

  if(operator==='*') {
    OUT.push(`BIN ${retVal}, ${MULTI}, ${retVal}, ${retVal2}`)
  }else if(operator==='/') {
    OUT.push(`BIN ${retVal}, ${DIV}, ${retVal}, ${retVal2}`)
  }else if(operator==='+') {
    OUT.push(`BIN ${retVal}, ${ADD}, ${retVal}, ${retVal2}`)
  }else if(operator==='-') {
    OUT.push(`BIN ${retVal}, ${SUB}, ${retVal}, ${retVal2}`)
  }else if(operator==='<') {
    OUT.push(`BIN ${retVal}, ${LSR}, ${retVal}, ${retVal2}`)
  }else if(operator==='>') {
    OUT.push(`BIN ${retVal}, ${LGR}, ${retVal}, ${retVal2}`)
  }else if(operator==='==') {
    OUT.push(`BIN ${retVal}, ${EQU}, ${retVal}, ${retVal2}`)
  }else if(operator==='&&') {
    OUT.push(`BIN ${retVal}, ${AND}, ${retVal}, ${retVal2}`)
  }else if(operator==='===') {
    OUT.push(`BIN ${retVal}, ${SEQU}, ${retVal}, ${retVal2}`)
  }else if(operator==='!==') {
    OUT.push(`BIN ${retVal}, ${SNEQU}, ${retVal}, ${retVal2}`)
  }else if(operator==='||') {
    OUT.push(`BIN ${retVal}, ${OR}, ${retVal}, ${retVal2}`)
  }else if(operator==='instanceof') {
    OUT.push(`BIN ${retVal}, ${INSTANCEOF}, ${retVal}, ${retVal2}`)
  }else if(operator==='in') {
    OUT.push(`BIN ${retVal}, ${IN}, ${retVal}, ${retVal2}`)
  }else if(operator==='%') {
    OUT.push(`BIN ${retVal}, ${MOD}, ${retVal}, ${retVal2}`)
  }else if(operator==='<=') {
    OUT.push(`BIN ${retVal}, ${LSRE}, ${retVal}, ${retVal2}`)
  }else if(operator==='>=') {
    OUT.push(`BIN ${retVal}, ${LGRE}, ${retVal}, ${retVal2}`)
  }else if(operator==='!=') {
    OUT.push(`BIN ${retVal}, ${NEQU}, ${retVal}, ${retVal2}`)
  }else if(operator==='<<') {
    OUT.push(`BIN ${retVal}, ${BIT_MOV_LEFT}, ${retVal}, ${retVal2}`)
  }else if(operator==='>>') {
    OUT.push(`BIN ${retVal}, ${BIT_MOV_RIGHT}, ${retVal}, ${retVal2}`)
  }else if(operator==='^') {
    OUT.push(`BIN ${retVal}, ${XOR}, ${retVal}, ${retVal2}`)
  }else if(operator==='|') {
    OUT.push(`BIN ${retVal}, ${BIT_OR}, ${retVal}, ${retVal2}`)
  }else if(operator==='&') {
    OUT.push(`BIN ${retVal}, ${BIT_AND}, ${retVal}, ${retVal2}`)
  }else if(operator==='>>>') {
    OUT.push(`BIN ${retVal}, ${NO_SYMBOL_MOV_RIGHT}, ${retVal}, ${retVal2}`)
  }else{
    NotSupport(operator)
  }
}
function parseThrowStatement(Node, contexts) {
  const {argument}=Node
  OUT.push(`FLOW ${THROW}, ${parseSideValue(argument, contexts)}`)
}
function parseUpdateExpression(Node, contexts, retVal) {
  const {operator, prefix, argument}=Node
  if(!prefix && retVal) {
    const arg={left: argument, __keep: 1}
    let lv=parseAssignmentExpression(arg, contexts)
    OUT.push(`ATTR ${lv}`)
    OUT.push(`MOV ${retVal}, ${lv}`)
  }
  const arg={left: argument}
  if(operator==='++') {
    arg.operator='+='
    arg.right={type: 'NumericLiteral', value: 1}
  }else if(operator==='--') {
    arg.operator='-='
    arg.right={type: 'NumericLiteral', value: 1}
  }else{
    NotSupport(operator)
  }
  let lv=parseAssignmentExpression(arg, contexts)
  if(prefix && retVal) {
    OUT.push(`MOV ${retVal}, ${lv}`)
  }
}
function parseTryStatement(Node, contexts) {
  const ctx=contexts[contexts.length-1]
  const {block, handler, finalizer}=Node
  let try_flag=rndstr()

  OUT.push({type: 'try', value: {
    try_flag,
    param: handler? handler.param.name: 0, // handler.param 是 catch的变量
  }})
  parseNodeList(block, contexts, ctx)

  OUT.push({type: 'try', value: {
    try_flag,
  }, extra: 'catch'})
  if(handler) {
    let ctx2={[handler.param.name]: handler.param.name}
    parseNodeList(handler.body, contexts.concat([ctx2]), ctx2)
  }

  OUT.push({type: 'try', value: {
    try_flag,
  }, extra: 'finally'})
  if(finalizer) {
    parseNodeList(finalizer, contexts, ctx)
  }

  OUT.push({type: 'try', value: {
    try_flag,
  }, extra: 'endtry'})
}

function parseExpressionStatement(Node, contexts) {
  parseSideValue(Node.expression, contexts)
}

function parseAssignmentExpression(Node, contexts) {
  const {left, __keep, operator, right}=Node
  let lv, is_addr=1
  if(left.type==='Identifier') {
    for(let i=contexts.length; i-->0; ) {
      if(i===0 || contexts[i][left.name]) {
        contexts[i][left.name]=contexts[i][left.name] || left.name
      }
    }
    lv=left.name
    is_addr=0
  }else if(left.type==='MemberExpression') {
    lv=mallocVar()
    parseMemberExpression(left, contexts, lv)
  }else{
    NotSupport(left)
  }
  // 用于 UpdateExpression 后置的场景
  if(__keep) {
    return lv
  }
  let rv=parseSideValue(right, contexts)
  let qv=mallocVar()
  if(operator==='=') {
    OUT.push(`MOV ${qv}, ${rv}`)
  }else if(operator==='+=') {
    OUT.push(`BIN ${qv}, ${ADD}, ${lv}, ${rv}`)
  }else if(operator==='-=') {
    OUT.push(`BIN ${qv}, ${SUB}, ${lv}, ${rv}`)
  }else if(operator==='*=') {
    OUT.push(`BIN ${qv}, ${MULTI}, ${lv}, ${rv}`)
  }else if(operator==='/=') {
    OUT.push(`BIN ${qv}, ${DIV}, ${lv}, ${rv}`)
  }else if(operator==='<<=') {
    OUT.push(`BIN ${qv}, ${BIT_MOV_LEFT}, ${lv}, ${rv}`)
  }else if(operator==='>>=') {
    OUT.push(`BIN ${qv}, ${BIT_MOV_RIGHT}, ${lv}, ${rv}`)
  }else if(operator==='^=') {
    OUT.push(`BIN ${qv}, ${XOR}, ${lv}, ${rv}`)
  }else if(operator==='|=') {
    OUT.push(`BIN ${qv}, ${BIT_OR}, ${lv}, ${rv}`)
  }else if(operator==='&=') {
    OUT.push(`BIN ${qv}, ${BIT_AND}, ${lv}, ${rv}`)
  }else{
    NotSupport(operator)
  }

  if(is_addr) {
    OUT.push(`COPY ${lv}, ${qv}`)
    OUT.push(`ATTR ${lv}`)
  }else{
    OUT.push(`MOV ${lv}, ${qv}`)
  }

  return lv
}


function parseObjectExpression(Node, contexts, ret) {
  OUT.push(`MOV ${ret}, ${MEM_idxMapper.getIdxOf(0)}`)
  Node.properties.map(Node=>{
    if(Node.type==='ObjectProperty') {
      parseObjectProperty(Node, contexts, ret)
    }else{
      NotSupport(Node)
    }
  })
  if(!Node.properties.length) {
    OUT.push(`OBJ ${ret}`)
  }
}

function parseObjectProperty(Node, contexts, ret) {
  const {key, value}=Node

  if(key.type==='Identifier') {
    key.type='StringLiteral'
    key.value=key.name
  }
  let keyVal=parseSideValue(key, contexts)
  let valueVal=parseSideValue(value, contexts)
  OUT.push(`OBJ ${ret}, ${keyVal}, ${valueVal}`)
}

function parseUnaryExpression(Node, contexts, retVal) {
  const {operator, argument}=Node

  if(operator==='delete') {
    if(argument.type==='MemberExpression') {
      let lv=mallocVar()
      parseMemberExpression(argument, contexts, lv)
      OUT.push(`SIG ${retVal}, ${DELETE}, ${lv}`)
    }else{
      NotSupport(argument)
    }
    return
  }

  let jv=parseSideValue(argument, contexts)
  if(operator==='!') {
    OUT.push(`SIG ${retVal}, ${UNARY}, ${jv}`)
  }else if(operator==='typeof') {
    OUT.push(`SIG ${retVal}, ${TYPEOF}, ${jv}`)
  }else if(operator==='void') {
    OUT.push(`SIG ${retVal}, ${VOID}, ${jv}`)
  }else if(operator==='-') {
    OUT.push(`BIN ${retVal}, ${SUB}, ${MEM_idxMapper.getIdxOf(0)}, ${jv}`)
  }else if(operator==='+') {
    OUT.push(`BIN ${retVal}, ${MULTI}, ${MEM_idxMapper.getIdxOf(1)}, ${jv}`)
  }else if(operator==='~') {
    OUT.push(`SIG ${retVal}, ${BIT_NEGATE}, ${jv}`)
  }else{
    NotSupport(operator)
  }
}


function parseNewExpression(Node, contexts, ret) {
  parseCallExpression(Node, contexts, ret, 1)
}

function parseCallExpression(Node, contexts, retVal, isNew) {
  const ctx=contexts[contexts.length-1]
  const {callee, arguments}=Node
  let fn=parseSideValue(callee, contexts, 0, {noAttr: 1})
  let arg=mallocVar(), arr=[]
  if(arguments && arguments.length) {
    arguments.map((Node, i)=>{
      arr.push(parseSideValue(Node, contexts))
    })
  }
  OUT.push(`MOV ${arg}, ${MEM_idxMapper.getIdxOf(0)}`)
  OUT.push(`ARR ${[arg, ARR_ARRAY, ...arr].join(', ')}`)
  retVal=retVal || mallocVar()
  ctx[retVal]=retVal
  OUT.push(`CAL ${isNew? 1: 0}, ${retVal}, ${fn}, ${arg}`)
}

function parseArrayExpression(Node, contexts, retVal) {
  OUT.push(`MOV ${retVal}, ${MEM_idxMapper.getIdxOf(0)}`)
  let arr=[]
  Node.elements.map(Node=>{
    arr.push(parseSideValue(Node, contexts))
  })
  OUT.push(`ARR ${[retVal, ARR_ARRAY, ...arr].join(', ')}`)
}

function parseMemberExpression(Node, contexts, retVal) {
  const ctx=contexts[contexts.length-1]
  const {object, computed, property}=Node
  OUT.push(`MOV ${retVal}, ${MEM_idxMapper.getIdxOf(0)}`)
  OUT.push(`ARR ${retVal}, ${ARR_MEMBER}`)
  OUT.push(`ARR ${retVal}, ${parseSideValue(object, contexts)}`)
  ctx[retVal]=retVal
  if(property.type==='Identifier' && !computed) {
    property.type='StringLiteral'
    property.value=property.name
  }
  let prop=parseSideValue(property, contexts)
  OUT.push(`ARR ${retVal}, ${prop}`)
}

function parseVariableDeclaration(Node, contexts) {
  const ctx=contexts[contexts.length-1]
  Node.declarations.map(({id, init})=>{
    if(!init) return;
    let jv=parseSideValue(init, contexts)
    OUT.push(`MOV ${test_val(contexts, id.name)}, ${jv}`)
  })
}

function parseRegExpLiteral(Node, contexts, ret) {
  const {pattern, flags}=Node
  const fn=mallocVar(), arg=mallocVar()
  OUT.push(`MOV ${arg}, ${MEM_idxMapper.getIdxOf(0)}`)
  OUT.push(`ARR ${arg}, ${ARR_ARRAY}, ${MEM_idxMapper.getIdxOf(pattern)}, ${MEM_idxMapper.getIdxOf(flags)}`)
  OUT.push(`MOV ${fn}, ${test_val(contexts, 'RegExp')}`)
  OUT.push(`CAL 1, ${ret}, ${fn}, ${arg}`)
}

function compile(code, maskarr) {

  let p=require("@babel/parser").parse(code)
  let contexts=parseNodeList(p.program)
  const MEM=MEM_idxMapper.getArr()

  // 优化指令
  let OUT_tmp, i
  // 1. 前后相同的 MOV x, y 去掉连续的后面一行
  i=0, OUT_tmp=[]
  for(let ls; i<OUT.length; i++) {
    if(OUT[1].constructor===String && ls===OUT[i] && ['MOV'].indexOf(OUT[i].split(/[\s,]+/)[0])>-1) {
      continue
    }
    ls=OUT[i]
    OUT_tmp.push(ls)
  }
  OUT=OUT_tmp
  // 2. 对同一个变量赋值ARR合并成一句
  i=0, OUT_tmp=[]
  for(; i<OUT.length; i++) {
    if(!i || OUT[i-1].constructor!==String || OUT[i].constructor!==String) {
      OUT_tmp.push(OUT[i])
      continue
    }
    const r0=OUT[i-1].split(/[\s,]+/)
    const r1=OUT[i].split(/[\s,]+/)
    if(r0[0]===r1[0] && r0[0]==='ARR' && r0[1]===r1[1]) {
      OUT_tmp[OUT_tmp.length-1]+=' '+r1.slice(2).join(', ')
    }else{
      OUT_tmp.push(OUT[i])
    }
  }
  OUT=OUT_tmp
  // 3. 对同一个变量赋值OBJ合并成一句
  i=0, OUT_tmp=[]
  for(; i<OUT.length; i++) {
    if(!i || OUT[i-1].constructor!==String || OUT[i].constructor!==String) {
      OUT_tmp.push(OUT[i])
      continue
    }
    const r0=OUT[i-1].split(/[\s,]+/)
    const r1=OUT[i].split(/[\s,]+/)
    if(r0[0]===r1[0] && r0[0]==='OBJ' && r0[1]===r1[1]) {
      OUT_tmp[OUT_tmp.length-1]+=' '+r1.slice(2).join(', ')
    }else{
      OUT_tmp.push(OUT[i])
    }
  }
  OUT=OUT_tmp
  // 4. 对连续MOV语句合并成一句
  i=0, OUT_tmp=[]
  for(let mv=[], _mv=mv=>{
    if(mv.length) {
      OUT_tmp.push(`MOV `+mv.reduce((a, b)=>{
        a[0]+=', '+b[0]
        a[1]+=', '+b[1]
        return a
      }).join(', '))
    }
    mv.splice(0)
  }; i<OUT.length; i++) {
    if(OUT[i].constructor!==String) {
      _mv(mv)
      OUT_tmp.push(OUT[i])
      continue
    }
    const r=OUT[i].split(/[\s,]+/)
    if(r[0]==='MOV') {
      mv.push(r.slice(1))
    }else{
      _mv(mv)
      OUT_tmp.push(OUT[i])
    }
  }
  OUT=OUT_tmp

  // 把ctx转为VAR
  let OUT2=[]
  OUT.map((x, i)=>{
    if(typeof x!=='object') {
      OUT2.push(x)
    }else if(x.type==='ctx') {
      const fv=Object.values(x.value).filter(a=>typeof a!=='object')
      if(fv.length) {
        OUT2.push(`VAR ${fv.join(', ')}`)
      }
    }else if(x.type==='func') {
      if(x.extra!=='end_func') {
        x.value.beginLine=OUT2.length
        OUT2.push(x)
        const fv1=Object.values(x.value.ctx)
        if(fv1.length) {
          OUT2.push(`VAR ${fv1.join(', ')}`)
        }
      }else{
        let f=OUT2.find(a=>a.type==='func' && a.value.func_flag===x.value.func_flag && !a.extra)
        f.value.endLine=OUT2.length
      }
    }else if(x.type==='if') {
      if(!x.extra) {
        x.value.beginLine=OUT2.length
        OUT2.push(x)
      }else if(x.extra==='else') {
        let f=OUT2.find(a=>a.type==='if' && a.value.if_flag===x.value.if_flag && !a.extra)
        f.value.elseLine=OUT2.length
      }else if(x.extra==='endif') {
        let f=OUT2.find(a=>a.type==='if' && a.value.if_flag===x.value.if_flag && !a.extra)
        f.value.endLine=OUT2.length
      }
    }else if(x.type==='try') {
      if(!x.extra) {
        x.value.beginLine=OUT2.length
        OUT2.push(x)
      }else if(x.extra==='catch') {
        let f=OUT2.find(a=>a.type==='try' && a.value.try_flag===x.value.try_flag && !a.extra)
        f.value.catchLine=OUT2.length
      }else if(x.extra==='finally') {
        let f=OUT2.find(a=>a.type==='try' && a.value.try_flag===x.value.try_flag && !a.extra)
        f.value.finallyLine=OUT2.length
      }else if(x.extra==='endtry') {
        let f=OUT2.find(a=>a.type==='try' && a.value.try_flag===x.value.try_flag && !a.extra)
        f.value.endLine=OUT2.length
      }
    }else if(x.type==='for') {
      if(!x.extra) {
        x.value.beginLine=OUT2.length
        OUT2.push(x)
      }else if(x.extra==='endtest') {
        let f=OUT2.find(a=>a.type==='for' && a.value.for_flag===x.value.for_flag && !a.extra)
        f.value.testedLine=OUT2.length
      }else if(x.extra==='endupdate') {
        let f=OUT2.find(a=>a.type==='for' && a.value.for_flag===x.value.for_flag && !a.extra)
        f.value.updatedLine=OUT2.length
      }else if(x.extra==='endfor') {
        let f=OUT2.find(a=>a.type==='for' && a.value.for_flag===x.value.for_flag && !a.extra)
        f.value.endLine=OUT2.length
      }
    }else if(x.type==='switch') {
      if(!x.extra) {
        x.value.beginLine=OUT2.length
        x.value.casesValueLine=[]
        OUT2.push(x)
      }else if(x.extra==='endcompare') {
        let f=OUT2.find(a=>a.type==='switch' && a.value.switch_flag===x.value.switch_flag && !a.extra)
        f.value.casesValueLine.push(OUT2.length, x.value.caseVal)
      }else if(x.extra==='endcase') {
        let f=OUT2.find(a=>a.type==='switch' && a.value.switch_flag===x.value.switch_flag && !a.extra)
        f.value.casesValueLine.push(OUT2.length)
      }
    }
  })

  // 处理行数
  let OUT3=[]
  for(let i=0; i<OUT2.length; i++) {
    const x=OUT2[i]
    if(typeof x!=='object') {
      OUT3.push(x)
    }else if(x.type==='func') {
      OUT3.push(`FUNC ${x.value.refFn}, ${x.value.endLine}`)
    }else if(x.type==='if') {
      OUT3.push(`IF ${x.value.jv}, ${x.value.elseLine}, ${x.value.endLine}`)
    }else if(x.type==='try') {
      OUT3.push(`TRY ${x.value.param}, ${x.value.catchLine}, ${x.value.finallyLine}, ${x.value.endLine}`)
    }else if(x.type==='for') {
      OUT3.push(`FOR ${x.value.fortestval}, ${x.value.testedLine}, ${x.value.updatedLine}, ${x.value.endLine}`)
    }else if(x.type==='switch') {
      OUT3.push(`SWITCH ${[x.value.jv, ...x.value.casesValueLine].join(', ')}`)
    }else{
      NotSupport(x)
    }
  }

  // 变量名替换成MEM虚拟下标
  const VAR_idxMapper=idxMapper(MEM_idxMapper.getArr().length)
  const OUT4=OUT3.map(a=>a.split(/[\s,]+/).map((a, i)=>{
    if(!i) return CMDLS_map[a]
    if(parseInt(a)+''===a) return a*1
    return VAR_idxMapper.getIdxOf(a)
  }))

  for(let key in contexts[0]) {
    globalContextVars[VAR_idxMapper.getIdxOf(key)]=key
  }

  // 打包成序列
  const OUT6=pack(maskarr, OUT4, MEM)

  return {
    TXT: OUT3.map((a, i)=>`${(i+1+'').padStart(3, ' ')}. ${(_=>{
      _=_.replace(new RegExp('(^| )'+mvPrefix, 'g'), '$1X')
      const [cmd, ...vals]=_.split(/[\s,]+/)
      return cmd+' '+vals.map((a, i)=>{
        if(parseInt(a)+''===a && +a<MEM.length) return JSON.stringify(MEM[+a])
        return '['+a+']'
      }).join(', ')
    })(a)}`).join('\n'),
    MEM: JSON.stringify(MEM),
    GVARS: JSON.stringify(globalContextVars),
    SEQ: OUT4.map((a, i)=>`${i+1}. ${a.join(' ')}`).join('\n'),
    BIN: OUT6,
  }
}

module.exports=compile
