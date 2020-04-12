// Type下的类型有好多8、16、32这些，这些代表的是多少位
// 比如100可以用Uint8来存，但是70000就要用uInt16了
import {  Type, encode, decode, singleArray, registerProto } from './SimpleProtoBinary'
// var { registerProto, Type, encode, decode, singleArray } = binary;
registerProto(1001, {
    name: Type.String,
    age: Type.Uint8,
    sex: Type.Uint8
})
registerProto(1002, {
    info: 1001,
    gold: Type.Uint16,
    items: [Type.Uint16, Type.String32]
})
// singleArray代表单一类型数组，如数组中任一元素的类型都是相同的
// 单一类型数据也可以不用singleArray修饰，但用singleArray修饰之后会进一步压缩数据大小
registerProto(1003, {
    array0: Type.Array16,
    array1: singleArray(1002),
    array2: singleArray([1001, 1002]),
    array3: singleArray(Type.Uint16),
    array4: singleArray([Type.Uint16, Type.String32])
})

var buffer = encode({ name: 'Mary', age: 18, sex: 0 }, 1001);
decode(buffer);

var buffer = encode({ info: { name: 'Mary', age: 18, sex: 0 }, gold: 10, array: [100, 2, 3] }, 1002);
decode(buffer);

var buffer = encode({
    array0: ['你好啊','我很好'],
    array1: [{ info: { name: 'James', age: 30, sex: 1 }, gold: 10, array: [100, 2, 3] }],
    array2: [[{}, { info: { name: 'Mary', age: 18, sex: 0 }, gold: 10, array: [100, 2, 3] }]],
    array3: [568],
    array4: [[0, '零'], [1, '一'], [2, '二'], [3, '三']]
}, 1003);
decode(buffer);

// 在nodejs里面进行Buffer与ArrayBuffer的互转操作，使用下面的两个方法
 // Buffer ---> ArrayBuffer
 function toArrayBuffer(buf) {
     var ab = new ArrayBuffer(buf.length);
     var view = new Uint8Array(ab);
     for (var i = 0; i < buf.length; ++i) {
         view[i] = buf[i];
     }
     return ab;
 }
 // ArrayBuffer ---> Buffer
 function toBuffer(ab) {
    var buf = new Uint8Array(ab.byteLength);
    // var buf = new Buffer(ab.byteLength);
     var view = new Uint8Array(ab);
     for (var i = 0; i < buf.length; ++i) {
         buf[i] = view[i];
     }
     return buf;
 }