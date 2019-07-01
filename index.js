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
  const answerFile = path.join(
    process.cwd(),
    'answer.js'
  );
  fs.openSync(answerFile, 'a');

  co(function*() {
    let a = yield prompt("a: ");
    let b = yield prompt("b: ");

    if(!a || !b){
      console.log('Inputs cannot be empty')
      process.exit(1)
    };

    a = parseInt(a);
    b = parseInt(b);

    if (isNaN(a) || isNaN(b)){
      console.log('Please input a valid number')
      process.exit(1)
    };

    const action = yield prompt("action (+, -, /, *): ");

    if(!actions.includes(action)){
      console.log("Please input a valid action")
      process.exit(1)
    };

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

        if (data.search(searchRegex) <= 0) {
          fs.appendFileSync(
            answerFile,
            `const ${actionName}${a}And${b}= ${answer}` + '\n'
          );
        } ;
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