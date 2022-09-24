
const {CMDLS, NotSupport, mask, CMDLS_BIN_ext, CMDLS_FLOW_ext, CMDLS_SIG_ext, ARR_typ}=require('./common')
const [VAR, FUNC, FVAR, MOV, BIN, IF, ARR, CAL, TRY, FOR, FLOW, ATTR, OBJ, SWITCH, SIG, COPY, FARGU, LOG]=CMDLS
const [LGR, LSR, EQU, ADD, MULTI, SUB, DIV, AND, SEQU, SNEQU, OR, INSTANCEOF, IN, MOD, LSRE, LGRE, NEQU, BIT_MOV_LEFT, BIT_MOV_RIGHT, XOR, BIT_AND, BIT_OR, NO_SYMBOL_MOV_RIGHT]=CMDLS_BIN_ext
const [RET, THROW, BREAK, CONTINUE]=CMDLS_FLOW_ext
const [UNARY, TYPEOF, VOID, DELETE, INIT_THIS, BIT_NEGATE]=CMDLS_SIG_ext
const [ARR_ARRAY, ARR_MEMBER]=ARR_typ

let typ_i=1
const typeVar=typ_i++
const typeFunc=typ_i++
const typeArr=typ_i++ // 普通数组
const typeArrMember=typ_i++ // 取值时需要先reduce
const typeObj=typ_i++
const typeGlobalObject=typ_i++

function unpack(OUT6, outerVars, top, maskarr) {
  outerVars=outerVars || {}
  // 先还原为原始序列
  OUT6=mask(maskarr, OUT6, 1)

  let _out1=[]
  for(let i=0; i<OUT6.length; i++) {
    if(OUT6[i]===0) {
      i+=2
      if(OUT6[i]===0) {
        _out1.push(0)
      }else{
        let n=0
        for(let j=OUT6[i]; j-->0; ) {
          n+=OUT6[++i]<<(8*j)
        }
        _out1.push(n)
      }
    }else{
      _out1.push(OUT6[i])
    }
  }

  // 取出常量和全局变量
  let OUT=[], c=1
  for(let i=0; i<_out1[0]; i++) {
    let n=_out1[c]
    OUT.push(_out1.slice(c+1, c+n+1))
    c+=1+n
  }
  let [MEM, gv]=JSON.parse(String.fromCharCode(..._out1.slice(c+1, c+1+_out1[c])))
  let globalContextVars={}
  for(let i=0; i<gv.length; i+=2) {
    globalContextVars[gv[i]]=gv[i+1]
  }
  c+=1+_out1[c]

  const gobj={}
  for(let idx in globalContextVars) {
    let kk=globalContextVars[idx]
    try{
      if(top.hasOwnProperty(kk)===false && outerVars.hasOwnProperty(kk)===false) continue
    }catch(e) {}
    gobj[idx]=outerVars[kk] || top[kk]
  }
  return [OUT, MEM, gobj]
}

let OUT3 // 此变量仅用于调试，因此不考虑窜线场景

function find_val(contexts, val, useValue, mustDefined) {
	for(let j=contexts.length; j-->0; ) {
    const o=contexts[j][val]
    if(!o) continue
    return useValue? o.value: o
  }
  if(mustDefined) {
    throw new Error(`${val} is not defined`)
  }
  const o={value: val, type: typeVar}
  contexts[0][val]=o
  return useValue? o.value: o
}

function parse_val(SEQ, MEM, contexts, x, fullNode, notMustDefined) {
  let _ret=node=>fullNode? node: node.value
	if(x<MEM.length) return _ret({value: MEM[x], type: typeGlobalObject})
  return _ret(find_val(contexts, x, 0, notMustDefined? 0: 1))
}
function set_val(contexts, key, val, type) {
  const found=find_val(contexts, key)
  found.value=val
  found.type=type || typeVar
}
function parse_member_array(arr) {
  return arr.reduce((a, b)=>a[b])
}

// params: [入参数组，是否已return，return的结果, this]
function runner(SEQ, MEM, contexts, begin=0, end=-1, params=null) {
  if(end===-1) {
    const globalContext=contexts[0]
    let ctx2={
      _lastContexts: [0, {}],
    }
    for(let a in globalContext) {
      ctx2[a]={value: globalContext[a], type: typeGlobalObject}
    }
    contexts=[ctx2]
  }
	contexts=contexts.concat([])
  for(let i=begin, ctx=contexts[contexts.length-1], I=(end<0? SEQ.length: end); i<I; i++) {
    // console.log("###", [i, end], OUT3[i], SEQ[i])
  	const [CMD, ...argv]=SEQ[i]
    if(CMD===FVAR) {
      for(let i=0; i<argv.length; i++) {
        set_val(contexts, argv[i], params[0][i])
      }
    }else if(CMD===OBJ) {
      const [ret, ...kv]=argv
      const obj=find_val(contexts, ret)
      if(obj.type!==typeObj) {
        obj.value={}
        obj.type=typeObj
      }
      for(let i=0; i<kv.length; i+=2) {
        let key=parse_val(SEQ, MEM, contexts, kv[i]),
            value=parse_val(SEQ, MEM, contexts, kv[i+1])
        obj.value[key]=value
      }
    }else if(CMD===FLOW) {
      const [op, val]=argv
      let rval
      if(val===undefined) {
        rval=undefined
      }else{
        rval=parse_val(SEQ, MEM, contexts, val)
      }

      if(op===RET) {
        params[1]=RET
        params[2]=rval
      }else if(op===BREAK) {
        params[1]=BREAK
      }else if(op===CONTINUE) {
        params[1]=CONTINUE
      }else if(op===THROW) {
        throw rval
      }else{
        NotSupport(op)
      }
      break
    }else if(CMD===ATTR) {
      const [retVal]=argv
      const fd=parse_val(SEQ, MEM, contexts, retVal)
      let fe
      if(fd.constructor===Array) {
        fe=parse_member_array(fd)
      }else if(fd.constructor===String) {
        fe=parse_val(SEQ, MEM, contexts, fd, 0, 1)
      }else{
        fe=fd
      }
      set_val(contexts, retVal, fe)
    }else if(CMD===COPY) {
      const [retVal, copy_val]=argv
      const fd1=find_val(contexts, retVal)
      const fd2=parse_val(SEQ, MEM, contexts, copy_val)
      fd1.value.reduce((a, b, i)=>{
        if(i<fd1.value.length-1) return a[b]
        else a[b]=fd2
      })
    }else if(CMD===BIN) {
      const [ret, op, v1, v2]=argv
      let p1=parse_val(SEQ, MEM, contexts, v1, 1), p2=parse_val(SEQ, MEM, contexts, v2, 1)

      ; [p1, p2]=[p1, p2].map(p=>{
        if(p.type===typeArrMember) {
          return parse_member_array(p.value)
        }else return p.value
      })

      let rr
      if(op===LGR) rr=p1>p2
      else if(op===LSR) rr=p1<p2
      else if(op===ADD) rr=p1+p2
      else if(op===SUB) rr=p1-p2
      else if(op===MULTI) rr=p1*p2
      else if(op===DIV) rr=p1/p2
      else if(op===EQU) rr=p1==p2
      else if(op===AND) rr=p1 && p2
      else if(op===SEQU) rr=p1===p2
      else if(op===SNEQU) rr=p1!==p2
      else if(op===OR) rr=p1 || p2
      else if(op===INSTANCEOF) rr=p1 instanceof p2
      else if(op===IN) rr=p1 in p2
      else if(op===MOD) rr=p1 % p2
      else if(op===LSRE) rr=p1 <= p2
      else if(op===LGRE) rr=p1 >= p2
      else if(op===NEQU) rr=p1 != p2
      else if(op===BIT_MOV_LEFT) rr=p1<<p2
      else if(op===BIT_MOV_RIGHT) rr=p1>>p2
      else if(op===XOR) rr=p1 ^ p2
      else if(op===BIT_AND) rr=p1 & p2
      else if(op===BIT_OR) rr=p1 | p2
      else if(op===NO_SYMBOL_MOV_RIGHT) rr=p1 >>> p2
      else NotSupport(op)
      set_val(contexts, ret, rr)
    }else if(CMD===IF) {
      const [judge, else_l, endif_l]=argv
      if(find_val(contexts, judge, 1)) {
        runner(SEQ, MEM, contexts, i+1, else_l, params)
      }else{
        runner(SEQ, MEM, contexts, else_l, endif_l, params)
      }
      i=endif_l-1
    }else if(CMD===VAR) {
  		ctx={}
  	  contexts=contexts.concat([ctx])
  	  argv.map(v=>ctx[v]={value: undefined, type: typeVar})
  	}else if(CMD===FUNC) {
  	  const [func_fn, func_line_end]=argv
      const [begin_l, end_l]=[i+1, func_line_end]
      set_val(contexts, func_fn, function(...argu) {
        let params=[argu, 0, undefined, this]
        runner(SEQ, MEM, contexts.concat([{}]), begin_l, end_l, params)
        return params[2]
      }, typeFunc)
  	  i=func_line_end-1
  	}else if(CMD===MOV) {
      for(let i=0, n=argv.length/2; i<n; i++) {
        let {type, value}=parse_val(SEQ, MEM, contexts, argv[n+i], 1)
  		  set_val(contexts, argv[i], type===typeArrMember? parse_member_array(value): value)
      }
  	}else if(CMD===ARR) {
      let [val, ...x]=argv
  		const found=find_val(contexts, val)
      if(!found.value) {
        found.value=[]
        let p=x.shift()
        if(p===ARR_ARRAY) {
          found.type=typeArr
        }else if(p===ARR_MEMBER) {
          found.type=typeArrMember
        }else{
          NotSupport(p)
        }
      }
      for(let i=0; i<x.length; i++) {
        let v=parse_val(SEQ, MEM, contexts, x[i])
        found.value.push(v)
      }
  	}else if(CMD===CAL) {
      const [isNew, ret, fn, arg]=argv
      let argu=parse_val(SEQ, MEM, contexts, arg) || []
      let func=parse_val(SEQ, MEM, contexts, fn)
      let realFunc, realThis, _hasSetThis=0
      if(typeof func==='function') {
        realFunc=func
      }else if(func.constructor===Array) {
        let fn, _this
        for(let i=0; i<func.length; i++) {
          if(!i) {
            // if(typeof func[i]==='string') fn=find_val(contexts, func[i], 1)
            // else
            fn=func[i]
          }else{
            fn=fn[func[i]]
          }
          if(i<func.length-1) _this=fn
        }
        realFunc=fn
        realThis=_this
        _hasSetThis=1
      }else if(func.constructor===String) {
        realFunc=find_val(contexts, func, 1)
      }else{
        NotSupport(func)
      }

      let returnVal
      if(isNew) {
        returnVal=new realFunc(...argu)
      }else{
        returnVal=realFunc.apply(_hasSetThis? realThis: (params ? params[3]: this), argu)
      }
      set_val(contexts, ret, returnVal)
    }else if(CMD===TRY) {
      const [e, catch_l, finally_l, end_l]=argv
      try{
        runner(SEQ, MEM, contexts, i+1, catch_l, params)
      }catch(err) {
        if(e===0) throw err
        runner(SEQ, MEM, contexts.concat([{
          [e]: {type: typeVar, value: err}
        }]), catch_l, finally_l, params)
      }finally{
        runner(SEQ, MEM, contexts, finally_l, end_l, params)
      }
      i=end_l-1
    }else if(CMD===FOR) {
      const [test_val, endtest_l, endupdate_l, end_l]=argv
      // params的第1个参数表示流程控制，取 CMDLS_BIN_ext[] 常量
      // break：params[1]=BREAK
      // continue：params[1]=CONTINUE
      let for_params=params || [[], 0, undefined, this]
      for(;;) {
        runner(SEQ, MEM, contexts, i+1, endtest_l)
        const tested=parse_val(SEQ, MEM, contexts, test_val)
        if(!tested) break
        runner(SEQ, MEM, contexts, endupdate_l, end_l, for_params)
        const v=for_params[1]
        if(v===CONTINUE) for_params[1]=0 // continue
        if(v===BREAK || v===RET) {
          if(v===BREAK) for_params[1]=0
          break
        }
        runner(SEQ, MEM, contexts, endtest_l, endupdate_l)
      }
      i=end_l-1
    }else if(CMD===SWITCH) {
      const [judgeVal, ...caseValLines]=argv
      const realVal=parse_val(SEQ, MEM, contexts, judgeVal)
      for(let si=0, lstLine=i+1, matched=false; si<caseValLines.length; si+=3) {
        const caseExpLineEnd=caseValLines[si]
        const caseLineEnd=caseValLines[si+2]
        let exp_params=params || [[], 0, undefined, this]
        runner(SEQ, MEM, contexts, lstLine, caseExpLineEnd, exp_params)
        const ve=exp_params[1]
        if(ve===THROW) break
        const caseVal=parse_val(SEQ, MEM, contexts, caseValLines[si+1])
        if(caseVal===realVal) matched=true
        if(matched) {
          let switch_params=params || [[], 0, undefined, this]
          runner(SEQ, MEM, contexts, caseExpLineEnd, caseLineEnd, switch_params)
          const v=switch_params[1]
          if(v===BREAK || v===RET) {
            if(v===BREAK) switch_params[1]=0
            break
          }
        }
        lstLine=caseLineEnd
      }
      i=caseValLines[caseValLines.length-1]-1
    }else if(CMD===SIG) {
      const [ret, op, v1]=argv
      let p1, rr
      if(op===TYPEOF) {
        for(let j=contexts.length; j-->0; ) {
          if(!contexts[j][v1]) continue
          rr=typeof contexts[j][v1].value
        }
        if(!rr) rr='undefined'
      }else{
        p1=parse_val(SEQ, MEM, contexts, v1)
      }
      if(rr);
      else if(op===UNARY) rr=!p1
      else if(op===VOID) rr=void p1
      else if(op===DELETE) {
        rr=p1.reduce((a, b, i)=>{
          if(i<p1.length-1) return a[b]
          else return delete a[b]
        })
      }else if(op===INIT_THIS) {
        rr=contexts[0]
      }else if(op===BIT_NEGATE) {
        rr=~p1
      }
      else NotSupport(op)
      set_val(contexts, ret, rr)
    }else if(CMD===FARGU) {
      const [_arguments, _this]=argv
      set_val(contexts, _arguments, params[0])
      set_val(contexts, _this, params[3])
    }else if(CMD===LOG) {
      const [...v]=argv
      for(let i=0; i<v.length; i++) {
        console.log({key: v[i], value: parse_val(SEQ, MEM, contexts, v[i], 1)})
      }
    }else{
      NotSupport(OUT3[i] || (i+1+'. '+SEQ[i]))
  	}
    if(params && params[1]) break
  }
}

module.exports=([BIN, TXT], VARS, top, maskarr)=>{
  const [SEQ, MEM, globalContext]=unpack(BIN, VARS, top, maskarr)
  if(TXT) OUT3=TXT.split('\n')
  runner(SEQ, MEM, [globalContext])
}
