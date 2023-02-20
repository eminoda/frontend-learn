function A() {
  this.name = 'abc'
}
A.prototype.toSay = function () {
  console.log('A toSay')
}
console.log(A)
console.log(A.prototype)

const aIns = new A()
console.log(aIns)

function B() {
  A.call(this)
  this.age = 30
}
B.prototype.toSay = 1
console.log(new B())

var bIns = new B()
console.log(bIns.toSay)

console.log(bIns.hasOwnProperty('name'))
console.log(bIns.hasOwnProperty('age'))
console.log(bIns.hasOwnProperty('toSay'))

var test = {
  name: 'eminoda',
  age: 30,
}
console.log(Object.prototype.hasOwnProperty(test, 'age'))
