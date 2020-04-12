
 
/**
 * 类似于protobuffer，但此库及其精简且专为js打造
 * @author zp
 * @version 1.0.0
 * 
 * [注] nodejs环境下通过Uint8Array将ArrayBuffer和Buffer互相转换
 * @example
 * // Buffer ---> ArrayBuffer
 * function toArrayBuffer(buf) {
 *     var ab = new ArrayBuffer(buf.length);
 *     var view = new Uint8Array(ab);
 *     for (var i = 0; i < buf.length; ++i) {
 *         view[i] = buf[i];
 *     }
 *     return ab;
 * }
 * // ArrayBuffer ---> Buffer
 * function toBuffer(ab) {
 *     var buf = new Buffer(ab.byteLength);
 *     var view = new Uint8Array(ab);
 *     for (var i = 0; i < buf.length; ++i) {
 *         buf[i] = view[i];
 *     }
 *     return buf;
 * }
 */

class Encode {
    private buffer: ArrayBuffer = null;
    private view: DataView = null;
    private index: number = 0;

    constructor(length: number) {
        this.buffer = new ArrayBuffer(length)
        this.view = new DataView(this.buffer);
        this.index = 0;
    }

    setInt8(data: number) {
        if (!isNumber(data)) data = 0;
        return this.view.setInt8(this.index++, data);
    }

    setUint8(data: number) {
        if (!isNumber(data)) data = 0;
        return this.view.setUint8(this.index++, data);
    }

    setInt16(data: number) {
        if (!isNumber(data)) data = 0;
        var value = this.view.setInt16(this.index, data);
        this.index += 2;
        return value;
    }

    setUint16(data: number) {
        if (!isNumber(data)) data = 0;
        var value = this.view.setUint16(this.index, data);
        this.index += 2;
        return value;
    }

    setInt32(data: number) {
        if (!isNumber(data)) data = 0;
        var value = this.view.setInt32(this.index, data);
        this.index += 4;
        return value;
    }

    setUint32(data: number) {
        if (!isNumber(data)) data = 0;
        var value = this.view.setUint32(this.index, data);
        this.index += 4;
        return value;
    }

    setFloat32(data: number) {
        if (!isNumber(data)) data = 0;
        var value = this.view.setFloat32(this.index, data);
        this.index += 4;
        return value;
    }

    setFloat64(data: number) {
        if (!isNumber(data)) data = 0;
        var value = this.view.setFloat64(this.index, data);
        this.index += 8;
        return value;
    }

    setBoolean(data) {
        return this.setUint8(data ? 1 : 0);
    }

    setString(string, byte = 1) {
        if (!isString(string)) string = '';
        this.setUint16(string.length);

        if (byte == 4) {
            for (var i = 0, strLen = string.length; i < strLen; i++) {
                this.setUint32(string.charCodeAt(i));
            }
        } else if (byte == 2) {
            for (var i = 0, strLen = string.length; i < strLen; i++) {
                this.setUint16(string.charCodeAt(i));
            }
        } else {
            for (var i = 0, strLen = string.length; i < strLen; i++) {
                this.setUint8(string.charCodeAt(i));
            }
        }
    }

    setString8(string) {
        this.setString(string, 1);
    }

    setString16(string) {
        this.setString(string, 2);
    }

    setString32(string) {
        this.setString(string, 4);
    }

    setArray(array, byte = 1) {
        if (isArray(array) && !isEmpty(array)) {
            return this.setString(JSON.stringify(array), byte);
        } else {
            return this.setString('', byte);
        }
    }

    setArray8(array) {
        return this.setArray(array, 1);
    }

    setArray16(array) {
        return this.setArray(array, 2);
    }

    setArray32(array) {
        return this.setArray(array, 4);
    }

    setObject(obj, byte = 1) {
        if (isMap(obj) && !isEmpty(obj)) {
            return this.setString(JSON.stringify(obj), byte);
        } else {
            return this.setString('', byte);
        }
    }

    setObject8(obj) {
        return this.setObject(obj, 1);
    }

    setObject16(obj) {
        return this.setObject(obj, 2);
    }

    setObject32(obj) {
        return this.setObject(obj, 4);
    }

    getBuffer() {
        return this.buffer;
    }
}

class Decode {
    private view: DataView = null;
    private index: number = 0;

    constructor(buffer: ArrayBuffer) {
        this.view = new DataView(buffer);
        this.index = 0;
    }

    getInt8() {
        return this.view.getInt8(this.index++);
    }

    getUint8() {
        return this.view.getUint8(this.index++);
    }

    getInt16() {
        var value = this.view.getInt16(this.index);
        this.index += 2;
        return value;
    }

    getUint16() {
        var value = this.view.getUint16(this.index);
        this.index += 2;
        return value;
    }

    getInt32() {
        var value = this.view.getInt32(this.index);
        this.index += 4;
        return value;
    }

    getUint32() {
        var value = this.view.getUint32(this.index);
        this.index += 4;
        return value;
    }

    getFloat32() {
        var value = this.view.getFloat32(this.index);
        this.index += 4;
        return value;
    }

    getFloat64() {
        var value = this.view.getFloat64(this.index);
        this.index += 8;
        return value;
    }

    getBoolean() {
        return !!this.getUint8();
    }

    getString(byte = 1) {
        var strLen = this.getUint16();

        var str = '';
        if (byte == 4) {
            for (var i = 0; i < strLen; i++) {
                str += String.fromCharCode(this.getUint32());
            }
        } else if (byte == 2) {
            for (var i = 0; i < strLen; i++) {
                str += String.fromCharCode(this.getUint16());
            }
        } else {
            for (var i = 0; i < strLen; i++) {
                str += String.fromCharCode(this.getUint8());
            }
        }

        return str;
    }

    getString8() {
        return this.getString(1);
    }

    getString16() {
        return this.getString(2);
    }

    getString32() {
        return this.getString(4);
    }

    getArray(byte = 1) {
        const str = this.getString(byte);
        return str ? JSON.parse(str) : [];
    }

    getArray8() {
        return this.getArray(1);
    }

    getArray16() {
        return this.getArray(2);
    }

    getArray32() {
        return this.getArray(4);
    }

    getObject(byte = 1) {
        const str = this.getString(byte);
        return str ? JSON.parse(str) : {};
    }

    getObject8() {
        return this.getObject(1);
    }

    getObject16() {
        return this.getObject(2);
    }

    getObject32() {
        return this.getObject(4);
    }
}

const getType = function (param) {
    return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
}

const isArray = function (param) {
    return getType(param) === 'array';
}

const isMap = function (param) {
    return getType(param) === 'object';
}

const isString = function (param) {
    return getType(param) === 'string';
}

const isNumber = function (param) {
    return getType(param) === 'number';
}

const isBoolean = function (param) {
    return getType(param) === 'boolean';
}

function isEmpty(obj) {
    if (isArray(obj)) {
        return !obj.length;
    } else if (isMap(obj)) {
        for (const key in obj) {
            return false;
        }
    }
    return true;
}

function compareStr(str1: string, str2: string) {
    if (str1 === str2) {
        return 0;
    }
    const len = Math.max(str1.length, str2.length);
    for (let i = 0, code1 = 0, code2 = 0; i < len; i++) {
        if (str1.length <= i) {
            return -1;
        } else if (str2.length <= i) {
            return 1;
        } else {
            code1 = str1.charCodeAt(i);
            code2 = str2.charCodeAt(i);
            if (code1 > code2) {
                return 1;
            } else if (code1 < code2) {
                return -1;
            }
        }
    }
    return 0;
}

function sortKeys(obj) {
    if (isMap(obj)) {
        let index = 0;
        const keys: string[] = [];
        for (const key in obj) {
            for (index = keys.length - 1; index >= 0; index--) {
                // if (key.localeCompare(keys[index]) >= 0) {
                if (compareStr(key, keys[index]) >= 0) {
                    break;
                }
            }
            if (index === keys.length - 1) {
                keys.push(key);
            } else {
                keys.splice(index + 1, 0, key);
            }
        }
        return keys;
    } else if (isArray(obj)) {
        return obj.map(function (v, k) {
            return k;
        })
    }

    return [];
}

function realType(type) {
    if (isArray(type) || isMap(type)) {
        return type;
    }
    return protoCache[type] || type;
}

const singleArrayPrefix = 'SingleArray';

function isSingleArray(str: string) {
    return isString(str) && str.indexOf(singleArrayPrefix) === 0;
}

function getSingleArrayProto(str: string) {
    const stringify = str.slice(singleArrayPrefix.length + 1, -1);
    return JSON.parse(stringify);
}

/**
 * 标记单一类型的数组
 * @param proto 
 */
export const singleArray = function (proto) {
    return `${singleArrayPrefix}(${JSON.stringify(proto)})`;
}

function getDataLen(data: any, proto: any) {
    proto = realType(proto);

    let length = 0;
    if (isMap(proto)) {
        if (!isMap(data)) data = {};
        for (const key in proto) {
            length += getDataLen(data[key], proto[key]);
        }
    } else if (isArray(proto)) {
        if (!isArray(data)) data = [];
        proto.forEach(function (type, index) {
            length += getDataLen(data[index], type);
        })
    } else if (isSingleArray(proto)) {
        // 如果是SingleArray的话，固定开头有2字节记录数组长度
        length += 2;
        if (!isArray(data)) data = [];
        proto = realType(getSingleArrayProto(proto));
        data.forEach(function (value) {
            length += getDataLen(value, proto);
        })
    } else if (TypeByte[proto]) {
        const byte = TypeByte[proto];

        if (proto.indexOf('String') === 0) {
            // 如果是String的话，固定开头有2字节记录字符串长度
            length += 2;
            if (isString(data)) length += data.length * byte;
        } else if (proto.indexOf('Object') === 0 || proto.indexOf('Array') === 0) {
            // Object和Array类型也会将数据通过JSON.stringify转成String格式
            length += 2;
            if (!isEmpty(data)) length += JSON.stringify(data).length * byte;
        } else {
            length += byte;
        }
    } else {
        throw new Error("'proto' is bad");
    }

    return length;
}

function encodeData(encode: Encode, data: any, proto: any) {
    proto = realType(proto);

    if (isMap(proto)) {
        if (!isMap(data)) data = {};
        sortKeys(proto).forEach(function (key) {
            encodeData(encode, data[key], proto[key]);
        })
    } else if (isArray(proto)) {
        if (!isArray(data)) data = [];
        proto.forEach(function (type, index) {
            encodeData(encode, data[index], type);
        })
    } else if (isSingleArray(proto)) {
        if (!isArray(data)) data = [];
        encode.setUint16(data.length);
        proto = realType(getSingleArrayProto(proto));
        data.forEach(function (value) {
            encodeData(encode, value, proto);
        })
    } else {
        encode['set' + proto](data);
    }
}

function decodeData(decode: Decode, proto: any) {
    proto = realType(proto);

    if (isMap(proto)) {
        const obj = {};
        sortKeys(proto).forEach(function (key) {
            obj[key] = decodeData(decode, proto[key]);
        });
        return obj;
    } else if (isArray(proto)) {
        return proto.map(function (type) {
            return decodeData(decode, type);
        });
    } else if (isSingleArray(proto)) {
        const arr = [];
        const len = decode.getUint16();
        proto = realType(getSingleArrayProto(proto));
        for (let index = 0; index < len; index++) {
            arr.push(decodeData(decode, proto));
        }
        return arr;
    } else {
        return decode['get' + proto]();
    }
}

const TypeByte = {
    'Int8': 1,
    'Uint8': 1,
    'Int16': 2,
    'Uint16': 2,
    'Int32': 4,
    'Uint32': 4,
    'Float32': 4,
    'Float64': 8,
    'BigInt64': 8,
    'BigUint64': 8,
    'Boolean': 1,
    'String8': 1,
    'String16': 2,
    'String32': 4,
    'Array8': 1,
    'Array16': 2,
    'Array32': 4,
    'Object8': 1,
    'Object16': 2,
    'Object32': 4,
}

export const Type = {
    'Int8': 'Int8',                 // 1byte  -128 to 127
    'Uint8': 'Uint8',               // 1byte  0 to 255
    'Uint8Clamped': 'Uint8',        // 1byte  0 to 255
    'Int16': 'Int16',               // 2byte  -32768 to 32767
    'Uint16': 'Uint16',             // 2byte  0 to 65535
    'Int32': 'Int32',               // 4byte  -2147483648 to 2147483647
    'Uint32': 'Uint32',             // 4byte  0 to 4294967295
    'Float32': 'Float32',           // 4byte  1.2x10^-38 to 3.4x10^38
    'Float64': 'Float64',           // 8byte  5.0x10^-324 to 1.8x10^308
    'BigInt64': 'BigInt64',         // 8byte  -2^63 to (2^63)-1
    'BigUint64': 'BigUint64',       // 8byte  0 to (2^64)-1
    'Boolean': 'Boolean',           // 1byte  0 to 255
    'String': 'String8',            // 1byte  0 to 255
    'String8': 'String8',           // 1byte  0 to 255
    'String16': 'String16',         // 2byte  0 to 65535
    'String32': 'String32',         // 4byte  0 to 4294967295
    'Array': 'Array8',              // 1byte  0 to 255
    'Array8': 'Array8',             // 1byte  0 to 255
    'Array16': 'Array16',           // 2byte  0 to 65535
    'Array32': 'Array32',           // 4byte  0 to 4294967295
    'Object': 'Object8',            // 1byte  0 to 255
    'Object8': 'Object8',           // 1byte  0 to 255
    'Object16': 'Object16',         // 2byte  0 to 65535
    'Object32': 'Object32',         // 4byte  0 to 4294967295
}

/**
 * 序列化
 * 开头2字节用来存储proto的id
 */
export const encode = function (obj: Object, id: number | string) {
    const proto = protoCache[id];
    if (proto) {
        const len = getDataLen(obj, proto);
        const encode = new Encode(len + 2);
        encode.setUint16(Number(id));
        encodeData(encode, obj, proto);
        return encode.getBuffer();
    } else {
        throw new Error("encode error: 'id' is bad");
    }
}

/**
 * 反序列化
 * 开头2字节代表proto的id
 */
export const decode = function (buffer: ArrayBuffer) {
    const decode = new Decode(buffer);
    const id = decode.getUint16();
    const proto = protoCache[id];
    if (proto) {
        return decodeData(decode, proto);
    } else {
        throw new Error("decode error: 'buffer' is bad");
    }
}

/**
 * proto缓存
 */
const protoCache = {}

/**
 * 注册proto
 * id: 必须是个正整数(或正整数字符串), 取值范围[0,65535]
 */
export const registerProto = function (id: number | string, proto: any) {
    if (typeof id === 'string') id = Number(id);

    if (isNumber(id) && Math.floor(id) === id && id >= 0 && id <= 65535 && !Type[id]) {
        protoCache[id] = proto;
    } else {
        throw new Error("registerProto error: 'id' is bad");
    }
}

export const registerProtoMap = function (protoMap: any) {
    if (isMap(protoMap)) {
        for (const id in protoMap) {
            registerProto(id, protoMap[id]);
        }
    } else {
        throw new Error("registerProtoMap error: 'protoMap' is bad");
    }
}

export const protoToJson = function () {
    return JSON.stringify(protoCache);
}
