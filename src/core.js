function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    if (a===0 || b===0) {
        return " 0 "
    }
    return (a * b) 
}

function divide(a, b) {
    if (b===0){
        return "Math Error"
    }
    else{
        return a/b
    }
}

function pow(a) {
    return a*a
}

function sqrt(a) {
    if (a<0){
        return "Math Error"
    }
    return Math.sqrt(a)
}    

export default {
    add: add,
    sub: subtract,
    mul: multiply,
    div: divide,
    pow: pow,
    sqrt: sqrt
}
