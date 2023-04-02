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
  predictionToText,
  formatListIntoSectionArrays,
  outputToText,
  numberToBinary,
  generateQuestions,
  saveFile,
} from "./utility.js";
import { generateQuestionAndAnswers } from "./generateQandA.js";

let inputs = 256;
let outputs = 256;
let count = 1000;
let equationText = "2x=4";
let SaveFile = false;
let PathName = "nn.json";
let TrainNN = false;

let nnAlg = new NeuralNetwork(inputs, 16, outputs);
let alg = {
  x: charToBinary("x"),
  equals: charToBinary("="),
  divide: charToBinary("/"),
  space: charToBinary(" "),
};

let [questions, answers] = generateQuestionAndAnswers();

let bigs = questions.map((question) =>
  flattenWithPadding(flattenList(question))
);
let bigsA = answers.map((answer) => flattenWithPadding(flattenList(answer)));

const toReadable = (list) =>
  list.map((item) => String.fromCharCode(binaryToNumber(item)));

async function logProgress(progress) {
  console.log(`Training progress: ${progress}%`);
}

async function train() {
  const progressInterval = 10; // Log progress every 10% completion
  const progressIncrement = Math.floor(count / (100 / progressInterval));

  for (let i = 0; i < count; i++) {
    // Pick random equation
    let rand = Math.floor(Math.random() * questions.length);
    let equation1 = bigs[rand].flatMap((x) => x);
    let answer1 = bigsA[rand].flatMap((x) => x);

    nnAlg.train(equation1, answer1);

    // Log progress asynchronously every 10% completion
    if ((i + 1) % progressIncrement === 0) {
      const progress = Math.floor(((i + 1) / count) * 100);
      await logProgress(progress);
    }
  }

  // Log final progress asynchronously
  await logProgress(100);
  console.log(await equation(equationText));
}

function equation(equationText) {
  let equation = addPadding(createEquation(equationText), inputs);
  console.log(equation);
  // let answer = (c - b) / a;
  let answer = nnAlg.predict(equation);
  return predictionToText(answer);
}

for (let i = 0; i < process.argv.length; i++) {
  switch (process.argv[i]) {
    case "-e":
      if (process.argv[i + 1] != undefined) {
        if (process.argv[i + 1].startsWith("-")) {
          continue;
        } else {
          equation(process.argv[i + 1]);
        }
      }
      break;
    case "-save":
      PathName = process.argv[i + 1];
      // if path is not provided, use default
      if (PathName === undefined) {
        PathName = "nn.json";
      } else {
        // check if PathName starts with a `-`
        if (PathName.startsWith("-")) {
          PathName = "nn.json";
        } else {
          // remove quotes
          PathName = PathName.replace(/['"]+/g, "");
        }
      }
      // save file
      SaveFile = true;
      break;
    case "-load":
      let path = process.argv[i + 1];
      // if path is not provided, use default
      if (path === undefined) {
        path = "nn.json";
      } else {
        // remove quotes
        path = path.replace(/['"]+/g, "");
      }
      // load file
      // check if path exists
      if (!fs.existsSync(path)) {
        console.log("File does not exist");
        break;
      } else {
        nnAlg.deserialize(fs.readFileSync(path, "utf8"));
      }
      console.log("Neural network loaded from " + path);
      break;
    case "-a":
      count = Number(process.argv[i + 1]);
      console.log("Training iterations set to " + count);
      break;

    case "-t":
      TrainNN = true;
      break;

    case "-h":
      console.log("Usage: node main.js [options]");
      console.log("Options:");
      console.log("-e [equation] - solve equation");
      console.log("-save [path] - save neural network to file");
      console.log("-load [path] - load neural network from file");
      console.log("-a [number] - set number of training iterations");
      break;
  }
}

import fs from "fs";

function equationToBinary(eq) {
  let binary = [];
  for (let i = 0; i < eq.length; i++) {
    binary.push(charToBinary(eq[i]));
  }
  return binary;
}

const fileContent = fs.readFileSync("questions.txt", "utf8");
const lines = fileContent.split(/\r?\n/);

function createEquation(equation) {
  let bin = [];
  for (let i = 0; i < equation.length; i++) {
    let char = equation[i];
    let binary = charToBinary(char);
    bin.push(binary);
  }
  let flatBin = bin.flatMap((x) => x);
  return flatBin;
}

async function trainOnData(input, target, amount) {
  for (let i = 0; i < amount; i++) {
    nnAlg.train(input, target);
  }
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let splitted = line.split("_");
  let polynomial = splitted[0];
  let root = splitted[1];
  let flatPolynomial = createEquation(polynomial);
  let flatRoot = createEquation(root);
  // await trainOnData(addPadding(flatPolynomial, inputs), addPadding(flatRoot, inputs), 10000);
  // save
  // fs.writeFileSync("nn.json", nnAlg.serialize());
}

import { questionList } from "./questions2.js";
import { create } from "domain";
console.log(questionList.length);

let pred = nnAlg.predict(addPadding(createEquation("x^2-x=0"), inputs));
console.log(outputToText(pred), inputs);

// fs.writeFileSync("questions2.js", "export const questionList = " + JSON.stringify(generateQuestions(100000)));

let qs = fs.readFileSync("questions2.js", "utf8");
if(TrainNN) {
  for (let i = 0; i < count; i++) {
    const question =
      questionList[Math.floor(Math.random() * questionList.length)];
    let polynomial = question.split("_")[0];
    let root = question.split("_")[1];
    let flatPolynomial = createEquation(polynomial);
    let flatRoot = createEquation(root);
    await trainOnData(
      addPadding(flatPolynomial, inputs),
      addPadding(flatRoot, inputs),
      1, false
    );
    await logProgress((i / count) * 100);
  
    if (SaveFile) {
      await saveFile(nnAlg, PathName, false);
    }
  }
}
console.log("Training complete");
