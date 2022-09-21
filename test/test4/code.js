function test(z) {
  z(test)
}
function _(){
  return {test:function test(test){
    test()
    return test
  }}
}
test(_().test(function test(a) {
  console.log(22, test)
}))

/*
var t=function(a){
  return a({x:2})
}
var _=function() {
  return {mask: function(x) {
    return x
  }}
}
; (e=t(_().mask(function t(t){
  for(var i=0; i<t.x; i++) {
    console.log(i)
  }
  return t
})))
console.log(e)
*/
