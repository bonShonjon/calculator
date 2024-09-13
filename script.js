const inputDisplay = document.querySelector(".subdisplay__input");
const expressionDisplay = document.querySelector(".subdisplay__expression");

let inputString = "";
let numberA = "";
let numberB = "";
let operator = "";
let numberAnswer = "";

const btnList = document.querySelectorAll(".button");
btnList.forEach((btn) => btn.addEventListener("click", onClick));

function onClick(e) {
  if (e.target.className.includes("button--special")) {
    onClickSpecial(e);
  } else if (e.target.className.includes("button--numerical")) {
    onClickNumerical(e);
  } else if (e.target.className.includes("button--operator")){
    onClickOperator(e);
  }
}

function onClickSpecial(e) {
  switch (e.target.textContent){
    case "C":
      inputString = "";
      numberA = "";
      numberB = "";
      operator = "";
      numberAnswer = "";
      updateInputDisplay();
      updateExpressionDisplay();
      break;
    case "=":
      numberB = inputString;
      resolveEquation();
      //stops operation if error detected
      if (inputString.includes("error")) {
        inputString = "";
        return
      }
      inputString = numberAnswer;
      updateInputDisplay();
      updateExpressionDisplay();
      inputString = ""
      numberA = numberAnswer.toString();
      numberB = "";
      operator = "";
      break;
    case "←":
      inputString = inputString.slice(0,-1);
      updateInputDisplay();
  }
}

function onClickNumerical(e) {
  //conditions to only allow one decimal point
  if (e.target.textContent !== "·" || !inputString.includes("·")) {
    inputString += e.target.textContent;
    updateInputDisplay();
    updateExpressionDisplay();
  }
}

function onClickOperator(e) {
  //if no number has been inputted, only "-" can be pressed to make number negative
  if (!inputString.length && e.target.textContent === "-" && numberAnswer === ""){
    inputString += "-";
    updateInputDisplay();
  //remove negative if no number inputted yet
  } else if (inputString === "-" && e.target.textContent === "-") {
    inputString = "";
    updateInputDisplay();
  //fill first number and operator
  } else if (!operator) {
    //populate input string if performing operation after pressing equals
    if (!inputString.length) {
      inputString = numberAnswer;
    }
    numberA = inputString;
    inputString = "";
    operator = e.target.textContent;
    updateExpressionDisplay();
  //fill second number, resolve equation, restart with new operator
  } else if (!numberB) {
    numberB = inputString;
    resolveEquation();
    //stop operation if error detected
    if (inputString.includes("error")) {
      inputString = "";
      return
    }
    updateExpressionDisplay();
    inputString = numberAnswer;
    updateInputDisplay();
    inputString = "";
    numberA = numberAnswer.toString();
    numberB = "";
    operator = e.target.textContent;

  }
}

function resolveEquation() {
  switch(operator) {
    case "+":
      numberAnswer = +numberA + +numberB;
      break;
    case "-":
      numberAnswer = +numberA - +numberB;
      break;
    case "×":
      numberAnswer = +numberA * +numberB;
      break;
    case "÷":
      //output error to screen and clear all values if divide by zero
      if (+numberB === 0){
        inputString = "Div zero error";
        numberA = "";
        numberB = "";
        operator = "";
        numberAnswer = ""
        updateInputDisplay();
        updateExpressionDisplay();
      } else {
      numberAnswer = +numberA / +numberB;
      }
      break;
  } 
}

function updateInputDisplay() {
  inputDisplay.textContent = inputString;
}

function updateExpressionDisplay() {
  expressionDisplay.textContent = `${numberA} ${operator} ${numberB}`;
}
