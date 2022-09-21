
// 定义指令集映射
let CMD_I=1
let CMDLS=[
 CMD_I++, // VAR
 CMD_I++, // FUNC
 CMD_I++, // FVAR
 CMD_I++, // MOV
 CMD_I++, // BIN
 CMD_I++, // IF
 CMD_I++, // ARR
 CMD_I++, // CAL
 CMD_I++, // TRY
 CMD_I++, // FOR
 CMD_I++, // FLOW
 CMD_I++, // ATTR
 CMD_I++, // OBJ
 CMD_I++, // SWITCH
 CMD_I++, // SIG
 CMD_I++, // COPY
 CMD_I++, // FARGU
 CMD_I++, // LOG
]

// CMDLS.BIN的子标志位
let CMDLS_BIN_ext_i=1
let CMDLS_BIN_ext=[
  CMDLS_BIN_ext_i++, // LGR >
  CMDLS_BIN_ext_i++, // LSR <
  CMDLS_BIN_ext_i++, // EQU ==
  CMDLS_BIN_ext_i++, // ADD +
  CMDLS_BIN_ext_i++, // MULTI *
  CMDLS_BIN_ext_i++, // SUB -
  CMDLS_BIN_ext_i++, // DIV /
  CMDLS_BIN_ext_i++, // AND &&
  CMDLS_BIN_ext_i++, // SEQU ===
  CMDLS_BIN_ext_i++, // SNEQU !==
  CMDLS_BIN_ext_i++, // OR ||
  CMDLS_BIN_ext_i++, // instanceof
  CMDLS_BIN_ext_i++, // in
  CMDLS_BIN_ext_i++, // MOD %
  CMDLS_BIN_ext_i++, // LSRE <=
  CMDLS_BIN_ext_i++, // LGRE >=
  CMDLS_BIN_ext_i++, // NEQU !=
  CMDLS_BIN_ext_i++, // BIT_MOV_LEFT <<
  CMDLS_BIN_ext_i++, // BIT_MOV_RIGHT >>
  CMDLS_BIN_ext_i++, // XOR ^
  CMDLS_BIN_ext_i++, // BIT_AND &
  CMDLS_BIN_ext_i++, // BIT_OR |
  CMDLS_BIN_ext_i++, // NO_SYMBOL_MOV_RIGHT >>>
]

// CMDLS.SIG的子标志位
let CMDLS_SIG_ext_i=1
let CMDLS_SIG_ext=[
  CMDLS_SIG_ext_i++, // UNARY
  CMDLS_SIG_ext_i++, // TYPEOF
  CMDLS_SIG_ext_i++, // VOID
  CMDLS_SIG_ext_i++, // DELETE
  CMDLS_SIG_ext_i++, // 初始化`this`命令
  CMDLS_SIG_ext_i++, // BIT_NEGATE ~
]

// CMDLS.FLOW的子标志位
let CMDLS_FLOW_ext_i=1
let CMDLS_FLOW_ext=[
  CMDLS_FLOW_ext_i++, // RET
  CMDLS_FLOW_ext_i++, // THROW
  CMDLS_FLOW_ext_i++, // BREAK
  CMDLS_FLOW_ext_i++, // CONTINUE
]


let ARR_typ_i=1
let ARR_typ=[
  ARR_typ_i++, // ArrayExpression
  ARR_typ_i++, // MemberExpression
]

function NotSupport(Node) {
  console.log('Not Support: ')
  console.log((new Error).stack)
  console.log(Node)
  process.exit()
}

function mask(maskarr, data, isDecode) {
  let c=0
  if(!maskarr) {
    c=1
    if(isDecode) {
      maskarr=[data[0]]
      data=data.slice(1, data.length)
    }else{
      maskarr=[Math.ceil(Math.random()*0xff)]
      data=[0, ...data]
    }
  }
  return data.map((a, i)=>{
    return a^((maskarr[(i+c)%maskarr.length]+i+c)%0xff)
  })
}

module.exports={
	CMDLS,
	NotSupport,
  mask,
	CMDLS_BIN_ext,
	CMDLS_FLOW_ext,
	CMDLS_SIG_ext,
  ARR_typ,
}
