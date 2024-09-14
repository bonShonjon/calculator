//define DOM elements for displays
const inputDisplay = document.querySelector(".subdisplay__input");
const expressionDisplay = document.querySelector(".subdisplay__expression");
//define DOM elements for buttons
const btnList = document.querySelectorAll(".button");
const btnListOperator = document.querySelectorAll(".button--operator")
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
    e.target.classList.add("button--highlight")
    setTimeout(() => e.target.classList.remove("button--highlight"), 200);
    onClickSpecial(e);
  } else if (e.target.className.includes("button--numerical")) {
    e.target.classList.add("button--highlight")
    setTimeout(() => e.target.classList.remove("button--highlight"), 200);
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
      //remove highlight from previously selected operator
      btnListOperator.forEach((btn)=>btn.classList.remove("button--highlight"));
      break;
    //pressing "=" resolves equation and updates displays
      case "=":
      numberB = inputString;
      resolveEquation();
      displayString = numberAnswer;
      handleError();
      expressionString = `${numberA} ${operator} ${numberB}`;
      updateExpressionDisplay();
      updateInputDisplay();
      //remove highlight from previously selected operator
      btnListOperator.forEach((btn)=>btn.classList.remove("button--highlight"));
      break;

  }
  }

//logic for numbers
function onClickNumerical(e) {
  //clear all values if entered after pressing "="
  if (numberAnswer.length) {
    inputString = "";
    expressionString = "";
    displayString = "";
    numberA = "";
    numberB = "";
    operator = "";
    numberAnswer = "";
  }
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
  //remove highlight from previously selected operator, add highlight to current selection
  btnListOperator.forEach((btn)=>btn.classList.remove("button--highlight"));
  e.target.classList.add("button--highlight");
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
    numberAnswer = "";
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
      if (numberB === "0") {
        numberAnswer = "Div zero error"
      } else {
        numberAnswer = +numberA / +numberB
      }
      break;
  }
  numberAnswer = numberAnswer.toString();
  //truncate answer to 9 signigicant figures
  if (!isNaN(numberAnswer) && numberAnswer.length > 9) {
    numberAnswer = (+numberAnswer).toPrecision(9).toString();
  }
}

function updateInputDisplay() {
  //truncate display if too many digits
  if (displayString.length > 14){
    displayString = `...${displayString.slice(-14)}`
  }
  inputDisplay.textContent = displayString;
}

function updateExpressionDisplay() {
  if (expressionString.length > 25){
    expressionString = `...${expressionString.slice(-25)}`
  }  
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
