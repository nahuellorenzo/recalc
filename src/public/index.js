const $display = document.querySelector('.display')
const $buttons = document.querySelector('.buttons')

const operations = ['-','*','+', '^2','/', 'square', 'binary'];

let currentDisplay = "";
let operation = null;
let reset = false;


$buttons.addEventListener('click', async (e) => {
    const nextAction = e.target.name

    if (nextAction === "=") {
        let negative = false;
        if (currentDisplay.startsWith("-")&& operation === "-")
        {
            currentDisplay = currentDisplay.slice(1)
            negative = true;
        }
        const [firstArg, secondArg] = currentDisplay.split(operation)

        let result;
        
        if (operation === "-") {
            result = await calculateSub(negative ? firstArg*(-1): firstArg, secondArg)
        }

        if (operation === "binary") {
            result = await calculateBinary(firstArg)
        }

        if (operation === "^2"){
            if (parseInt(firstArg) > 100000){
                result = "error"
            }
            else{result = await calculatePow(firstArg)}
        } 

        if (operation === "/") {
            if(secondArg === "0"){
                result = "Math error"
            }
            else{
                result = await calculateDiv(firstArg, secondArg)
            }
        }
        
        if (operation === "*") {
            result = await calculateMul(firstArg, secondArg)
        }

        if (operation === "+") {
            result = await calculateAdd(firstArg, secondArg)
        }
    
        if (operation === "square"){
            result = await calculateSqrt(firstArg)
        }

        reset = true;
        if (result !== undefined) {
            result = renderDisplay(result);
        } else {
            result = renderDisplay(currentDisplay);
        }
        return result;
    }

    if (operations.includes(nextAction)) {
        operation = nextAction;
    }

    if (nextAction === "c") {
        return renderDisplay(0);
    }
    
    if (reset || currentDisplay === 0) {
        reset = false;
        operation = null;
        renderDisplay(nextAction);
    } else {
        renderDisplay(currentDisplay + nextAction);
    }
})

async function calculateSub(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/sub/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculatePow(firstArg) {
    const resp = await fetch(`/api/v1/pow/${firstArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateDiv(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/div/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateMul(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/mul/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateAdd(firstArg, secondArg) {
    const resp = await fetch(`/api/v1/add/${firstArg}/${secondArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateSqrt(firstArg) {
    const resp = await fetch(`/api/v1/sqrt/${firstArg}`)
    const { result } = await resp.json();

    return result;
}

async function calculateBinary(firstArg) {
    const resp = await fetch(`/api/v1/binary/${firstArg}`)
    const { result } = await resp.json();

    return result;
}

function renderDisplay(chars) {
    currentDisplay = chars;
    $display.value = chars;
}