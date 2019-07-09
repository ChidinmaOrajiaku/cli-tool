#!/usr/bin/env node

const fs= require('fs');
const path= require("path");
const prompt= require("co-prompt");
const co = require("co");
const program= require("commander");

const addNumbers = (a, b) => {
  return a + b;
};

const subtractNumbers = (a, b) => {
  if (a > b){
    return a - b;
  };
  return b - a
};

const multiplyNumbers = (a, b) => {
  return a*b
};

const divideNumbers = (a, b) => {
  return a/b
};

program
.action(() => {
  let answer, actionName;
  const actions = ['+', "-", "/", "*"];

  // get answer.js path
  const answerFile = path.join(
    process.cwd(),
    'answer.js'
  );

  // create answer.js file in current directory
  fs.openSync(answerFile, 'a');

  co(function*() {
    console.log("This program perfoms specified arithmetic operation on input")

    // prompt first number input
    let a = yield prompt("a: ");

    // keep prompting until user enters a valid input a
    while(!a || isNaN(a)){
      console.log('Please input a valid number for a')
      a = yield prompt("a: ");
    };

    // prompt second number input
    let b = yield prompt("b: ");

    // keep prompting until user enters a valid input b
    while(!b || isNaN(b)){
      console.log('Please input a valid number for b')
      b = yield prompt("b: ");
    };

    // prompt user to input required action
    let action = yield prompt("action (+, -, /, *): ");

    // keep prompting user until valid action is entered 
    while(!actions.includes(action)){
      console.log("Action can only include +, -, / or *)")
      action = yield prompt("action (+, -, /, *): ");
    };

    // perform arithmetic operation on input
    a = parseInt(a)
    b = parseInt(b)

    switch(action) {
      case "+": 
        answer = addNumbers(a, b);
        actionName = "add";
      break;
      case "-":
        answer = subtractNumbers(a, b);
        actionName = "subtract";
      break;
      case "/":
        answer = divideNumbers(a, b);
        actionName = "divide";
      break;
      case "*":
        answer = multiplyNumbers(a, b)
        actionName = "multiply";
      break;
    };

    try {
      fs.readFile(answerFile, "utf8", (error, data) => {
        if (error){
          console.log('An error occurred while reading file')
          process.exit(1)
        };

        const searchRegex = new RegExp(`\\bconst ${actionName}${a}And${b}\\b`);

        if (actionName !== "divide"){
          searchRegex2 = new RegExp(`\\bconst ${actionName}${b}And${a}\\b`);
        };

        // search if variable name already exists in file
        if (data.search(searchRegex) <= 0) {
          // append answer to file
          fs.appendFileSync(
            answerFile,
            `const ${actionName}${a}And${b}= ${answer}` + '\n'
          );
        };
        console.log(answer)
        process.exit(0)
      });
    } catch(error) {
      console.log('An error occurred. Please retry')
      process.exit(1)
    };
  }).catch(() => {
    console.log('The operation was not successful')
    process.exit(1)
  });
})
.parse(process.argv);