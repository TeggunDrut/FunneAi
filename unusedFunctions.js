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
  
    let sum = 0;
    // [0 - 1] value predictions, which we sum all the values
    const predictions = nnAdd.predict(inputArr, outputArr);
    predictions.forEach((x) => {
      sum += Math.round(x);
    });
    return sum;
};
  

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
};