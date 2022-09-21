if(1);

/*
!function(){

  console.log(100>>>2)

  //console.log(TTT)
  AA={xx: {yy: 7}}
  console.log(AA.xx)
  AA.p={T: {K: function(n){return n*9}}}
  AA.p.T.Z=AA.xx.yy
  console.log(AA, AA.p.T.K(99))

  console.log(void 0)

  var Q=function(h) {
    return h+13
  }
  function K(a, b, c) {
    return 'X'+[a,b,c].join('-')
  }
  function testfn() {
    var p=Date
    dd={
      1: 3,
      xx: !2,
      yy: 123,
      a: [1,2,3, p, function(i) {
        return 91*i
      }, Q, K],
      z: p,
      t: {zkzk: 121, q: function(a, b) {
        console.log(a+b)
        //return 333+a+b
        return function() {
          return (WWW=999*b)
        }
      }},
      KK: K,
      K2: [],
    }
    console.log('>WD>WEDW>ED>EWF>', dd.xx+''+dd.t.zkzk)
    dd.K2.X1=12345
    dd.K2.push(1,2,3,4)
    console.log("##", dd.K2, dd)
    return 'YYYYYYYYYYYYYYY'
  }

  testfn()

  function kkk(){
    console.log('<<<<', dd.xx, dd, dd.t.q(121, 22)()+'>>>>>>>>>>>', dd.a[4](1800), dd.a[5](500))
    console.log("---", dd.a[6](3,4,5), dd.KK(5,6,7))
    console.log(":::::::::::", dd.K2.X1)
    switch(dd.t.zkzk) {
      case 123:
        console.log('no')
      case 121:
        console.log('yes')
        return 'NONO'
      case 122:
        console.log('no')
        break
      default:
        console.log(">> DEFAULT")
    }
  }
  console.log(kkk(), '<--------')
  console.log(WWW)

  console.log('>>>>\n\n\n\n\n\n\n', testfn, !testfn, !!testfn)

  BB=!testfn? !!testfn: testfn()

  console.log(BB, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

  PP=77
  ;(function(){
  var PP=!3? 1: 2
  console.log(PP)
  })()
  console.log(PP)

  function _typeof(e) {
      return ("function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
          return typeof e;
      } : function(e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      })(e);
  }
  console.log(_typeof({xx: 22}))


  function T_getId() {
    return (Date.now()+Math.random()).toString(36)+'csdcds'
  }
  function aa(x, y) {
    console.log(11, T_getId(), x*y, 3, Array.prototype.slice.call(arguments).reduce(function(a, b){
      return a+b
    }), '<<')
  }
  setInterval(function aaaaaaaaaaaa() {aa(88,1000)}, 1e3)
  console.log("KAKAKA", aa(5,6,7,8,9,10))

  var e=111
  try{
    throw 1981
  }catch(e) {
    console.log('CSMCMDSCMDSMC', e+10)
  }finally{
    console.log(1717)
  }
  console.log(e)

  var j=Date
  var p=new j
  function khkh(){console.log(999333);return 2}
  console.log(p.getTime(), p.getSeconds()*1000, !khkh())

  for(var p=10, n=20; p<n; ++p, n-=1) {
          var x=p+3
          if(p<13) continue
          console.log('>>>', x, p, n)
          if(p>15) break
          else if(2>1){
                  console.log("&&---------------------", x)
                  //return 9991
          }
  }
  console.log('>>>****************************************', p)


  function a12345() {
    for(var p=10, n=20; p<n; ++p, n-=1) {
            var x=p+3
            if(p<13) continue
            console.log('>>>', x, p, n)
            if(p>15) break
            else{
                    console.log("&&", x)
                    return 9991
            }
    }
    console.log('>>>', p)
  }
  console.log('------------->', a12345())

  var p=[1,2,3,true]
  console.log('>>', 9+p.length, p.length*9+18, 'cds')

  function a(b,c){console.log(arguments, Array.prototype.slice.call(arguments).slice(0, 3), arguments.length)}
  a(1,2,3,4,5)

  var g=0
  function fx(n) {
    for(var i=0; i<n; i++) {
      g+=i
    }
    return g
  }
  function test(i) {
    if(i==1) return fx(10)
    if(i==7) return 888
    fx(20)
    return fx(30)
  }

  var f=Date
  console.log([1,2,3,4].reduce(function(a, i) {
    console.log(a+i, f.now())
    return a+i
  }), test(7))

  function testxx() {
    for(var i=0; i<10; i++) {
      if(i>5) return 123
    }
    return 222
  }

  arguments=23
  console.log([1,2,3,4].reduce(function xx(a, b, i){
    console.log('>>', xx, Array.prototype.slice.call(arguments).slice(0,3))
    return a+b+i
  }), (new Date).getTime(), arguments, testxx())

  console.log(Array.prototype.slice.call([1,2,3,4,5,6]).splice(0,3))

  function jj(a, b) {
    function xx(a, b) {
      console.log(this, a*b)
      return a+b*1000
    }
    xx(a, b)
    return 66, console.log(2222, ':::'), {id: 888, kk: xx}
  }


  console.log(jj.call({yy: 33}, 2,3,4).kk(13, 6))

    var i = {}, e = Object.prototype, c = e.hasOwnProperty,
      t = "function" == typeof Symbol ? Symbol : {},
      n = t.iterator || "@@iterator", r = t.asyncIterator || "@@asyncIterator",
      a = t.toStringTag || "@@toStringTag";

    function o(e, t, r) {
        return Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }), e[t];
    }

    var xx={}
    o(xx, 'z1', 222)
    console.log(xx)

  console.log('--\n'.repeat(5))

  function aaa(n) {
    var p=n && n instanceof Number
    console.log(p)
    if(n>0) {
      return aaa(n-1)
    }
    console.log('>>', n)
  }

  aaa(new Number(5))

  // process.exit()
  var g=new Uint8Array(0 || [1,2,3])
  console.log(g)

  var k=(x=1, y=2, z=3, j=42, function(a){return 8*a})
  console.log(k(90))

  try{
    if(11>3) throw new Error('xxxx')
  }catch(e) {
    console.log('MESSAGE:', e.message)
  }

  for(q='y', xx=1, yy=2, z={x: {y: 2}};;) {
    console.log('>>', xx, yy, z.x.y)
    xx++
    z.x.y+=2
    if(xx>5) break
  }

    t={x:{aa: 22}}
    r={vv: 'aa'}
    var n = t.x[r.vv];
    console.log('+++', n)


      if(x=1, y=2, x<y && (j=3, m=4, m<j)) {
        console.log(666, j, m, x*y)
      }else{
        console.log(777, m, j, x*y)
      }

  Q=(33, !0, 8)
  console.log(Q)

  if(33) {
    v2=(3, console.log(111), console.log(222), new Number(4));
    console.log(v2)
    p1=new Number(5)
    console.log(p1)
  }

  function MM(){
    a={}, b={}
    return a.xx=113, b.yy=a.xx+3, a? a.xx? (f=3, m=4, k=59): 5: 2
  }
  console.log(MM())

  if(2===2) console.log(x1=x2=x3=33)

  if(1>0) {
    console.log('xx'==='xx' && (console.log(300), 44))
    console.log('xx'==='xxx' && (console.log(400), 44))
    console.log('xx'==='xx' || (console.log(500), 44))
    console.log('xx'==='xxx' || (console.log(600), 44))
  }

  function F1() {
    var aa={key: 'k1', value: function(){console.log(888)}, zz: function(a, b) {return a*b, this.xx.yy[0]}}
    return {
      key: aa.key,
      value: aa.value,
      p: aa.zz.call({xx: {yy: [10]}}, 6, 9)
    }
  }

  console.log(F1(), F1().value())

  function ZZ() {
    var a, b={xx: {t: 123}}
    ; (a=b.xx).t=345
    console.log(a, b)
    // return (a=b.xx).t=678
    return (r1=(a=b.xx).t) && 1919
  }
  console.log(ZZ(), r1)

  var f=0 || {zz: {t:22, p:11}}
  console.log(f)
  delete f.zz.p
  console.log(f)

  var xx={}
  xx.uu=[{ff:3}]
  console.log(xx)

  var t=-9
  console.log(t*8)

  for(var f=-5; ++f<5; ) if(ZZ()) {
    console.log('>>', f)
  }


  ZZ = "function" == typeof ZZ && ZZ.constructor;
  console.log(ZZ)

  function HH() {
    var p={x:2, k: function(n){return n*10}}
    return p.x? p.k: p.k(3)
  }
  console.log('-->', HH()(99))


  ; (function(){
    for(var x in ({aa: 11, bb: 22})) {
      console.log(x)
    }
    console.log('>>',x)
  })()
  console.log('>>',x)

  for(o in [11,22,33]) console.log('??', o)
  for(var n=[8,9,10];n.length;) {
    console.log(n.pop())
  }


  function KK() {
    var y=this
    console.log(y.KS*98)
    for(var p in y) {
      p==='setTimeout' && (this[p+'x_']=339) && console.log('>><<', this[p], this, y[p+'x_'])
    }
  }
  KK.call({KS: 3, setTimeout: '33'})
  console.log(p)
  // process.exit()

  if(1>0) for(aXa in [1,2,3,4,5]) console.log(aXa)

  kkk='19.3'
  console.log(kkk, +kkk)

  console.log(2<=8, 3>=4, 3>=1)

  var ppx=(ok=13>3)? this.kk=121: 55
  console.log(ppx, ok, this===global? 'yes': 'no')

  var com=function(e, t) {
    console.log("@@##", ppx.zz)
    ppx.zz? console.log(33): console.log(66)
    if ("throw" === e.type) throw e.arg;
    return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg,
      this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t),
      kkk;
  }

  console.log(com({type: 'return', arg: new Error('888')}, {ff: 777}))

  var px=/s.+\.a/g, py=new RegExp('s.+?m', 'ig')
  MM='sxmxmxm.A'
  console.log(MM.match(px), py.test(MM), py.test(MM))



  try{
    try{
      console.log(111)
      throw 3
      console.log(222)
    }finally{
      console.log('finally')
    }
  }catch(e) {
    console.log(e)
  }

  var a=8
  console.log(1<<5, 32>>2, a<<9, a>>2, a<<=5, a>>=1)
  console.log(1^3, 1|2, 0xff & 0xa7, a|=0xf2)


  var a={x: 1, y: 2}
  for(;a.y<8;a.y++) switch(a.x=a.y) {
    case 2:
      console.log("### 22")
      break
    case 3:
      console.log("### 33")
      break
    case 'xx':
      console.log(333)
    default:
      console.log(a.y)
      if(a.y>6) break
  }

  var d=0, a=[4,5,6,7,8]
  for(;d<a.length;) console.log(a[d++])

  console.log(d<10? [1,2,3]: [4,5,6], ~9, ~d, ~~d)

  function aaT() {
    var xx=22
    {
      var yy=33
      {
        var kxk=yy+xx
      }
    }
    console.log(xx, yy, kxk)
  }
  aaT()
  // console.log(kxk)

  function jh(n) {
    return ({
      xx: 22,
      yy: 33,
      jj: 44
    })[n]
  }
  console.log(jh('yy'))

  var e={g: '.TMPDIR'}, t='g'
  var r = process.env[e[t].substr(1)];
  console.log(r)

  var R=0
  ; (R || [3,4,5]).map(function(a) {
    console.log(a)
  })

  var pq=0 || function C(XX) {
    if(XX!==60) console.log("##", C(60))
    return XX*100
  }

  console.log(pq(86))

  console.log(require('fs').readFileSync(__filename, 'utf8').slice(0, 30))

  function HH1() {
    return HH2() || 55
  }
  function HH2() {
    return 33
  }
  console.log(HH1())

  function XX() {
    var a=this, b=arguments, k={j:{p:3,k:4}}
    console.log(a, b, k.j, k)
  }
  XX.call({t: 4}, 5, 6, 7)

  function Context(m) {
    this.reset(m+10)
  }
  Context.prototype = { constructor: Context, reset: function reset(n){
    console.log(n*10)
  }}

  new Context(20)

  console.log(typeof MMZ)

  var H=function() {return 72}, a={
    K: function() {return 999}
  }
  console.log(typeof a.K(), typeof (H()*7), typeof (p=5), typeof lLL)

  for(a={}, b={y: 3}; b.y>0;) switch(a.x=b.y--) {
    case 1:
      console.log(11)
      break
    case ++a.x:
      console.log(22)
      break
    default:
      console.log('DEF')
  }


  var aaA=999
  setTimeout(function aaA(v){
    if(v!==10) console.log(1, aa(10))
    else console.log('yes')
  }, 1e3)
  console.log(aaA)

}();

/*
p={
  zz: function(a, b){
    this.X=1
    this.Y=2
    this.C=a*b
  }
}

t=new p.zz(2, 5)
console.log(t)
*/

/*
// TTT=123, Q=123
k={TTT: '444', Q: '666'}
console.log(k.TTT, k.Q)
console.log(TTT, Q)

/*
z={aa: 3, bb: 4}
for(var x in z) console.log(x)
*/
