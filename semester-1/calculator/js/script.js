const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons-container__btn");

let currentInput = "";
let expression = "";

// Loop through the buttons on the document
buttons.forEach((button) => {
  const val = button.textContent;
  const operator = button.dataset.operator;
  const action = button.dataset.action;

  //   Listen to an onclick event
  button.addEventListener("click", () => {
    if (operator) {
      // Concatnate and assign value to expression
      expression += currentInput + " " + operator + " ";
      currentInput = "";
    } else if (action === "del") {
      currentInput = currentInput.slice(0, -1);
    } else if (val === "=") {
      return;
    } else {
      currentInput += val;
    }
    // Call updateDisplay function to update the display
    updateDisplay();
  });
});

// Listen to when = is clicked
document.getElementById("equals").addEventListener("click", () => {
  try {
    let finalExpr = expression + currentInput;
    finalExpr = finalExpr.replace(/\^/g, "**");
    let result = eval(finalExpr);
    currentInput = result.toString();
    expression = "";
  } catch {
    // Catch any error that might occur
    currentInput = "Error";
    expression = "";
  }
  // Call updateDisplay function to update the display

  updateDisplay();
});

function updateDisplay() {
  // Output the value
  display.textContent = currentInput || "0";
}
