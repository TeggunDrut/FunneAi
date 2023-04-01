import NeuralNetwork from "./nn-mod.js";
import {
  binaryToNumber,
  charFromNumber,
  charToBinary,
  // numberToBinary,
  addPadding,
  flattenList,
  flattenWithPadding,
  formatListIntoSectionText,
  formatListIntoSectionArrays,
} from "./utility.js";
import { generateQuestionAndAnswers } from "./generateQandA.js";

let inputs = 2;
let outputs = 128;
let nnAdd = new NeuralNetwork(inputs, 2, outputs);
let max = 1 + outputs / 2; // 8 / 2 = 4 + 1 -> 5





let nnAlg = new NeuralNetwork(64, 4, 64);
let alg = {
  x: charToBinary("x"),
  equals: charToBinary("="),
  divide: charToBinary("/"),
  space: charToBinary(" "),
};

let [questions, answers] = generateQuestionAndAnswers();

// for (let i = 0; i < 10; i++) {
//   let a = Math.floor(Math.random() * 10) + 1; // Generate a random coefficient for x from 1 to 10
//   let b = a * (Math.floor(Math.random() * 10) + 1); // Calculate the corresponding value of x that satisfies the equation
//   let eq = flattenWithPadding(
//     charToBinary(a.toString()), // Convert the coefficient to binary and pass it to the equation function
//     alg.x,
//     alg.equals,
//     charToBinary(b.toString()) // Convert the value of x to binary and pass it to the equation function
//   );
//   questions.push(eq); // Add the equation to the array of questions

//   let ans = flattenWithPadding(
//     alg.x,
//     alg.equals,
//     charToBinary((b / a).toString()) // Calculate the answer to the equation and convert it to binary
//   );
//   answers.push(ans); // Add the answer to the array of answers
// }

function outputToText(list) {
  list = list.length === 64 ? list : addPadding(list);
  let divided = formatListIntoSectionArrays(list);
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


let bigs = questions.map((question) => flattenWithPadding(question));
let bigsA = answers.map((answer) => flattenWithPadding(answer));



const toReadable = (list) => list.map((item) => String.fromCharCode(binaryToNumber(item)));

let count = 10000;
for (let i = 0; i < count; i++) {
  // pcik random equation
  let rand = Math.floor(Math.random() * questions.length);
  let equation1 = bigs[rand];
  let answer1 = bigsA[rand];
  // nnAlg.train(
  //   flattenWithPadding(charToBinary("2"), alg.x, alg.equals, charToBinary("4")),
  //   flattenWithPadding(alg.x, alg.equals, charToBinary("2"))
  // );
  nnAlg.train(equation1, answer1);
  // console.log(i + "/" + count);
}

// console.log(flattenWithPadding(charToBinary("2"), alg.x, alg.equals, charToBinary("4")));
const predictions = nnAlg.predict(
  flattenWithPadding(charToBinary("2"), alg.x, alg.equals, charToBinary("4"))
);
let roundedPredictions = predictions.map((value) => Math.round(value));



// console.log(outputToText(questions[0].flatMap(x => x)));
for (let i = 0; i < questions.length; i++) {
  // console.log("Question: " + addPadding(questions[i]) + "\nAnswer: " + addPadding(answers[i]));
}
console.log(outputToText(flattenList(questions[0])));
// formatListIntoSectionText(roundedPredictions);
// // log the original equation and the predicted answer
// console.log(toReadable(formatListIntoSectionArrays(questions[3])));
// console.log(outputToText(roundedPredictions));
