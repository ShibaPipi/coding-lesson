function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const millseconds = now.getMilliseconds().toString().padStart(3, '0');
    clockElement.innerText = `${hours}:${minutes}:${seconds}:${millseconds}`;
    // clockElement.innerText = hours + ':' + minutes + ':' + seconds
}

// 每秒更新一次时钟
setInterval(updateClock, 1);
// const qw =  'qw'
// alert(qw);

// 初始调用以立即显示时间
updateClock();


function ex() {
    console.log(myVar) // 输出 undefined
    var myVar
    myVar = '我的 var 变量'
    console.log(myVar) // 正常输出
}

let pig = 'pig'

// let myString = `Hello, ${pig}~`
let myString = '<div><button id="greetButton">点击' + pig + '</button><p id="greeting"></p></div>'
console.log(myString)

let MYVAR
let $MYVAR
let _MYVAR
let MYVAR1990
// let 1990MYVAR1990



let camelCase

ex()
true
false
null //  空值，不存在的对象
undefined // 一个未赋值的
const John = {
    name: 'John',
    age: 21,
}
const Pig = {
    name: 'Pig',
    age: 18,
}
const students = [John, Pig]
// function ex4Let() {
//     if (true) {
//         let cat
//         cat = 'dodo'
//         console.log(cat) // 输出 dodo
//     }
//     console.log(cat) // 抛出一个异常
// }

// ex4Let()

// const myConst
// myConst = 'myConst'
const PI = 3.14
// PI = 3.1415
const myConst = 'myConst'
console.log(myConst)
