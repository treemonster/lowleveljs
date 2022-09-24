(_=>{
async function sleep(t) {
  return new Promise(r=>setTimeout(r, t))
}
const KK={
  MM: {x: 1e2, y: 2e2, z: 3e2}
}
const P=(_=>{
  async function xx() {
    for(let i in KK.MM) {
      await sleep(i)
      console.log(i)
    }
  }
  xx()
})()

})()