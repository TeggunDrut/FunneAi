import NeuralNetwork from "./nn-mod.js";
import {
  binaryToNumber,
  charFromNumber,
  charToBinary,
  numberToBinary,
  addPadding,
} from "./utility.js";

let inputs = 2;
let outputs = 128;
let nnAdd = new NeuralNetwork(inputs, 2, outputs);
let max = 1 + outputs / 2; // 8 / 2 = 4 + 1 -> 5


function getOutput(num1, num2) {
  let sum = num1 + num2;
  if (sum > outputs - 1) {
    console.log("Must add to less than or equal to " + (outputs - 1));
    return "Number too high";
  }
  let binarySum = numberToBinary(sum);
  let output = new Array(outputs).fill(0);
  for (let i = 0; i < binarySum.length; i++) {
    output[outputs - 1 - i] = binarySum[binarySum.length - 1 - i];
  }
  return output;
}

function sum(num1, num2, amount) {
  let inputArr = [num1, num2];
  let outputArr = getOutput(num1, num2);
  for (let a = 0; a < amount; a++) {
    // 16 / 2 = 8 + 1 -> 9
    for (let i = 0; i < max; i++) {
      for (let j = 0; j < max; j++) {
        nnAdd.train(inputArr, outputArr);
      }
    }
    console.log(a + "/" + amount);
  }
  let pred = nnAdd.predict(inputArr, outputArr);
  let readable = pred.map((x) => {
    if (x >= 0.5) {
      x = 1;
    } else {
      x = 0;
    }
    return x;
  });
  let sum = 0;
  for (let i = 0; i < readable.length; i++) sum += readable[i];
  return sum;
}

let nnAlg = new NeuralNetwork(64, 4, 64);
let alg = {
  x: charToBinary("x"),
  equals: charToBinary("="),
  divide: charToBinary("/"),
  space: charToBinary(" "),
};


function equation(...args) {
  let big = [];
  for (let i = 0; i < args.length; i++) {
    for (let j = 0; j < args[i].length; j++) {
      big.push(args[i][j]);
    }
  }
  if (big.length < 64) {
    let diff = 64 - big.length;
    for (let j = 0; j < diff; j++) {
      big.push(0);
    }
  }
  return big;
}
let questions = [];
let answers = [];

// for (let i = 0; i < 10; i++) {
//   let a = Math.floor(Math.random() * 10) + 1; // Generate a random coefficient for x from 1 to 10
//   let b = a * (Math.floor(Math.random() * 10) + 1); // Calculate the corresponding value of x that satisfies the equation
//   let eq = equation(
//     charToBinary(a.toString()), // Convert the coefficient to binary and pass it to the equation function
//     alg.x,
//     alg.equals,
//     charToBinary(b.toString()) // Convert the value of x to binary and pass it to the equation function
//   );
//   questions.push(eq); // Add the equation to the array of questions

//   let ans = equation(
//     alg.x,
//     alg.equals,
//     charToBinary((b / a).toString()) // Calculate the answer to the equation and convert it to binary
//   );
//   answers.push(ans); // Add the answer to the array of answers
// }

function outputToText(list) {
  let divided = divideOutput(list);
  let text = "";

  console.log(list);

  for (let i = 0; i < divided.length; i++) {
    let num = divided[i];
    console.log(num, binaryToNumber(num), String.fromCharCode(binaryToNumber(num)));
    let newnum = binaryToNumber(num);
    let char = charFromNumber(newnum);
    text += char;
  }
  return text;
}

function toBig(list) {
  return list.flatMap((x) => x);
}

for (let i = 0; i < 10; i++) {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = a * (Math.floor(Math.random() * 10) + 1);
  let equation1 = "";

  equation1 += a.toString();
  equation1 += "x";
  equation1 += "=";
  equation1 += b.toString();

  questions.push(equation1);

  let answer1 = "";
  answer1 += "x";
  answer1 += "=";
  answer1 += (b / a).toString();

  answers.push(answer1);
}

for (let i = 0; i < questions.length; i++) {
  let eq = questions[i];
  let equation1 = [];
  for (let j = 0; j < eq.length; j++) {
    let char = eq[j];
    let binary = charToBinary(char);
    equation1.push(binary);
  }
  questions[i] = equation1;
}
for (let i = 0; i < answers.length; i++) {
  let eq = answers[i];
  let equation1 = [];
  for (let j = 0; j < eq.length; j++) {
    let char = eq[j];
    let binary = charToBinary(char);
    equation1.push(binary);
  }
  answers[i] = equation1;
}

let bigs = [];
for (let i = 0; i < questions.length; i++) {
  bigs.push(addPadding(questions[i].flatMap((x) => x)));
}
let bigsA = [];
for (let i = 0; i < answers.length; i++) {
  bigsA.push(addPadding(answers[i].flatMap((x) => x)));

}
function roundOutput(list) {
  for (let item in list) {
    if (list[item] > 0.5) {
      list[item] = 1;
    } else {
      list[item] = 0;
    }
  }
  return list;
}

function divideOutput(list) {
  let l = [];
  if (list.length % 8 === 0) {
    let temp = [];
    for (let i = 0; i < list.length; i++) {
      temp.push(list[i]);
      if (temp.length === 8) {
        l.push(temp);
        temp = [];
      }
    }
  }
  return l;
}



function toReadable(list) {
  let l = [];
  for (let item in list) {
    l.push(String.fromCharCode(binaryToNumber(list[item])));
  }
  return l;
}
let count = 10000;
for (let i = 0; i < count; i++) {
  // pcik random equation
  let rand = Math.floor(Math.random() * questions.length);
  let equation1 = bigs[rand];
  let answer1 = bigsA[rand];
  // nnAlg.train(
  //   equation(charToBinary("2"), alg.x, alg.equals, charToBinary("4")),
  //   equation(alg.x, alg.equals, charToBinary("2"))
  // );
  nnAlg.train(equation1, answer1);
  // console.log(i + "/" + count);
}

// console.log(equation(charToBinary("2"), alg.x, alg.equals, charToBinary("4")));
let pred = nnAlg.predict(
  equation(charToBinary("2"), alg.x, alg.equals, charToBinary("4"))
);
let readable = roundOutput(pred);

const formatBinaryArray = (binaryArray) => {
  let output = "";
  for (let i = 0; i < binaryArray.length; i++) {
    output += binaryArray[i];
    if (output.length === 8) {
      console.log(output);
      output = "";
    }
  }
};

// console.log(outputToText(questions[0].flatMap(x => x)));
for (let i = 0; i < questions.length; i++) {
  // console.log("Question: " + addPadding(questions[i]) + "\nAnswer: " + addPadding(answers[i]));
}
console.log(outputToText(addPadding(toBig(questions[0]))));
// formatBinaryArray(readable);
// // log the original equation and the predicted answer
// console.log(toReadable(divideOutput(questions[3])));
// console.log(outputToText(readable));
