const {add, take} = require('./a.js')
const _ = require('lodash')

const arr = _.concat([1,2,3])
const sum = add(1, 2)
console.log('sum:', sum)
const sum1 = take(10, 10)
console.log('sum1:', sum1)
console.log('arr:', arr)