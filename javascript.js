const LOG = [];
const QUEUE = document.querySelector(".queue");
const opFunction = {
    '+': (x,y) => { return Number(x)+Number(y); },
    '-': (x,y) => { return x-y; },
    'x': (x,y) => { return parseFloat(x*y).toPrecision(15) / 1; },
    '/': (x,y) => { return parseFloat(x/y).toPrecision(15) / 1; }
};
const divideError = "ERR: Divide by Zero";
let newCalc = true;

/* =====================
    Event Set Up
===================== */
const buttons = document.querySelectorAll(".button");
const nums = document.querySelectorAll(".num");
const ops = document.querySelectorAll(".operator");
const ce = document.querySelector(".clear-entry");
const c = document.querySelector(".clear");
const back = document.querySelector(".back")
const pm = document.querySelector(".plusmin");
const eq = document.querySelector(".equal");
const container = document.querySelector(".container");
buttons.forEach(button => button.addEventListener("click", addClicked));
buttons.forEach(button => button.addEventListener("transitionend", removeClicked));
nums.forEach(num => num.addEventListener("click", clickNum));
ops.forEach(op => op.addEventListener("click", clickOperation));
ce.addEventListener("click", clearEntry);
c.addEventListener("click", clear);
back.addEventListener("click", backspace);
pm.addEventListener("click", plusMinus);
eq.addEventListener("click", calculate);
window.addEventListener("keydown", typeCheck);

/* =====================
    Button Functions
===================== */
function clickNum() {
    const num = this.textContent;

    if (newCalc)
        QUEUE.textContent = "0";

    if (QUEUE.textContent.length < 16) {
        if (QUEUE.textContent == "0")
            num == "." ? QUEUE.textContent += num : 
                QUEUE.textContent = num;
        else
            if (num != "." || QUEUE.textContent.indexOf(".") < 0)
                QUEUE.textContent += num;    
        newCalc = false;
    }
    else if (QUEUE.textContent === divideError && num !== ".") {
        QUEUE.textContent = num;
        newCalc = false;
    }
}

function clickOperation() {
    if (isNaN(QUEUE.textContent))
        return;
    if (QUEUE.textContent.substr(-1) === ".")
        QUEUE.textContent = QUEUE.textContent.replace(".", "");
    LOG.push(QUEUE.textContent);
    LOG.push(this.textContent);
    QUEUE.textContent = "0";
    updateDisplay();
}

function clear() {
    LOG.length = 0;
    clearEntry();
    updateDisplay();
}

function clearEntry() {
    QUEUE.textContent = "0";
}

function backspace() {
    if (newCalc === true)
        QUEUE.textContent = "0";
    else if (QUEUE.textContent != "0") {
        if (QUEUE.textContent.length == 1)
            QUEUE.textContent = "0";
        else
            QUEUE.textContent = QUEUE.textContent.slice(0, -1); 
    }
    else if (LOG.length > 1) {
        LOG.pop();
        QUEUE.textContent = LOG.pop();
        updateDisplay();
    }
}

function plusMinus() {
    if (QUEUE.textContent != "0")
        QUEUE.textContent.indexOf("-") < 0 ?
            QUEUE.textContent = "-" + QUEUE.textContent :
            QUEUE.textContent = QUEUE.textContent.replace("-", "");
}

function findFirst(op1, op2) {
    const min = Math.min(LOG.indexOf(op1), LOG.indexOf(op2));
    const max = Math.max(LOG.indexOf(op1), LOG.indexOf(op2));
    return min > 0 ? min : max;
}

function operate(index) {
    const x = LOG[index-1];
    const y = LOG[index+1];
    return opFunction[LOG[index]](x,y);
}

function calculateStep() {
    let index = findFirst("x", "/");
    if (index > 0) {
        let result = operate(index);
        LOG.splice(index-1, 3, result);
    }
    else {
        index = findFirst("+", "-");
        let result = operate(index);
        LOG.splice(index-1, 3, result);
    }
}

function calculate() {
    LOG.push(QUEUE.textContent);

    while (LOG.length > 1) {
        calculateStep();
    }
    if(LOG) {
        if (LOG[0] !== Infinity)
            QUEUE.textContent = LOG[0];
        else
            QUEUE.textContent = divideError;
        LOG.length = 0;
        updateDisplay();
        newCalc = true;
    }
}

function updateDisplay() {
    const log = document.querySelector(".log p");
    log.textContent = LOG.join(" ");
}

function addClicked() {
    this.classList.add("clicked");
}

function removeClicked() {
    this.classList.remove("clicked");
}

function typeCheck(e) {
    const button = document.querySelector(`div[data-key="${e.key}"]`);
    if(button) { 
        button.click();
    }
    else if (e.key === "Enter")
        document.querySelector(".equal").click();
}