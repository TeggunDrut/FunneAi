import fs from 'fs';

export async function saveFile(nn, pathName, log) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathName, nn.serialize(), (err) => {
      if (err) {
        if(log) console.log("Error writing file: " + err);
        reject(err);
      } else{
        if(log) console.log("Neural network saved to " + pathName);
        resolve();
      }
    });
  });
}

export function generateQuestions(numQuestions) {
  const questions = [];
  let count = 0;

  while (count < numQuestions) {
    let a = 0;
    let b = 0;
    let c = 0;
    while (a === 0) {
      a = getRandomInt(-10, 10);
    }
    while (b === 0) {
      b = getRandomInt(-10, 10);
    }
    while (c === 0) {
      c = getRandomInt(-10, 10);
    }
    const discriminant = b * b - 4 * a * c;

    if (isSquare(discriminant)) {
      const root = Math.sqrt(discriminant);
      const denom = 2 * a;
      const x1 = (-b + root) / denom;
      const x2 = (-b - root) / denom;
      const remainder1 = Math.abs(x1 % 1);
      const remainder2 = Math.abs(x2 % 1);
      const formattedX1 =
        Math.abs(remainder1 - 1) < remainder1 ? Math.ceil(x1) : x1.toFixed(2);
      const formattedX2 =
        Math.abs(remainder2 - 1) < remainder2 ? Math.ceil(x2) : x2.toFixed(2);
      questions.push(
        `${a}x^2+${b}x+${c}=0_x=${formattedX1},${formattedX2}`
      );
      count++;
    }
  }

  return questions;
}

function isSquare(num) {
  const root = Math.sqrt(Math.abs(num));
  return num >= 0 && root === Math.floor(root);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export const addPadding = (list, paddingAmount = 64) => {
  const paddedList = list;
  const paddingToAdd = paddingAmount - paddedList.length;
  for (let j = 0; j < paddingToAdd; j++) {
    paddedList.push(0);
  }
  return paddedList;
};

export const numberToBinary = (number) => {
  let converted = number.toString(2);

  return addPadding(
    converted
      .split("")
      .map((x) => parseInt(x))
      .reverse(),
    8
  );
};

export function outputToText(list, paddingAmount = 64) {
  list = list.length === paddingAmount ? list : addPadding(list);
  let divided = formatListIntoSectionArrays(list);
  let text = "";

  for (let i = 0; i < divided.length; i++) {
    let num = divided[i];
    let newnum = binaryToNumber(num);
    let char = charFromNumber(newnum);
    text += char;
  }
  return text;
}

export const charToBinary = (char) => {
  // convert char to unicode number
  let unicode = char.charCodeAt(0);
  // convert unicode to binary
  let binary = numberToBinary(unicode);
  return binary;
};

export const charFromNumber = (number) => String.fromCharCode(number);

export const binaryToNumber = (binary) => {
  let number = 0;
  for (let i = 0; i < binary.length; i++) {
    number += binary[i] * Math.pow(2, i);
  }
  return number;
};

// Padding and List Manipulation

// [[1], [2]] into [1, 2]
export const flattenList = (list) => list.flatMap((x) => x);
export const flattenWithPadding = (...args) => addPadding(flattenList(args));

// [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] into
// 10101010
// 10101010
export const formatListIntoSectionText = (list) => {
  let output = "";
  for (let i = 0; i < list.length; i++) {
    output += list[i];
    if (output.length === 8) {
      console.log(
        output.split("").reverse().join(""),
        binaryToNumber(output.split("").reverse().join("")),
        String.fromCharCode(binaryToNumber(output.split("").reverse().join("")))
      );
      output = "";
    }
  }
  return output;
};

// [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] into
// [[1, 0, 1, 0, 1, 0, 1, 0] [1, 0, 1, 0, 1, 0, 1, 0]]
export const formatListIntoSectionArrays = (list) => {
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
};

export const predictionToText = (output) => {
  return outputToText(output.map((x) => Math.round(x)));
};
