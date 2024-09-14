//define DOM elements for displays
const inputDisplay = document.querySelector(".subdisplay__input");
const expressionDisplay = document.querySelector(".subdisplay__expression");
//define DOM elements for buttons
const btnList = document.querySelectorAll(".button");
btnList.forEach((btn) => btn.addEventListener("click", onClick));

//define variables
let inputString = "";
let expressionString = "";
let displayString = "";
let numberA = "";
let numberB = "";
let operator = "";
let numberAnswer = "";

//logic based on button class
function onClick(e) {
  if (e.target.className.includes("button--special")) {
    onClickSpecial(e);
  } else if (e.target.className.includes("button--numerical")) {
    onClickNumerical(e);
  } else if (e.target.className.includes("button--operator")){
    onClickOperator(e);
  }
}

//logic for "C", "←", and "="
function onClickSpecial(e) {
  switch(e.target.textContent) {
    //pressing "←" remove last character from input string
    case "←":
      inputString = inputString.slice(0,-1);
      displayString = inputString;
      updateInputDisplay();
      break;
    //pressing "C" clears all variables and displays
    case "C":
      inputString = "";
      expressionString = "";
      displayString = "";
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
      displayString = numberAnswer;
      handleError();
      expressionString = `${numberA} ${operator} ${numberB}`;
      updateExpressionDisplay();
      updateInputDisplay();
      break;

  }
  }

//logic for numbers
function onClickNumerical(e) {
  //only allow one decimal point
  if (e.target.textContent === "." && inputString.includes(".")) {
    return
  }
  inputString += e.target.textContent;
  displayString = inputString;
  updateInputDisplay();
  updateExpressionDisplay();
}

//logic for operators
function onClickOperator(e) {
  //only allow negation when input string is empty
  if (!inputString.length) {
    if (e.target.textContent === "-") {
      inputString += "-";
      displayString = inputString;
      updateInputDisplay();
    }
  } else {
    //When no numberA, only populate numberA
    if (!numberA.length) {
      operator = e.target.textContent;
      numberA = inputString;
      inputString = "";
      expressionString = `${numberA} ${operator} ${numberB}`;
      updateExpressionDisplay();
    } else {
    //If numberA is present, resolve existing equation
    numberB = inputString;
    resolveEquation();
    displayString = numberAnswer;
    handleError();
    expressionString = `${numberA} ${operator} ${numberB}`;
    updateExpressionDisplay();
    updateInputDisplay();
    //Use answer as numberA for next equation
    numberA = numberAnswer;
    operator = e.target.textContent;
    inputString = "";
    expressionString = `${numberAnswer} ${operator}`
    }
  }

}

function resolveEquation() {
  //Do not operate if not every field is full
  if (numberA === "" || numberB === "" || operator === "") {
    return
  }
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
      if (numberB = "0") {
        numberAnswer = "Div zero error"
      } else {
        numberAnswer = +numberA / +numberB
      }
      break;
  }
  numberAnswer = numberAnswer.toString();
}

function updateInputDisplay() {
  inputDisplay.textContent = displayString;
}

function updateExpressionDisplay() {
  expressionDisplay.textContent = expressionString;
}

function handleError() {
  //if present, display error and clear all variables
  if (numberAnswer.includes("error")) {
    inputString = "";
    expressionString = "";
    displayString = numberAnswer;
    numberA = "";
    numberB = "";
    operator = "";
    numberAnswer = "";
  }
}
