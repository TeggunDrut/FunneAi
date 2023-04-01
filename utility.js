export const numberToBinary = (number) => {
    if (number === 0) {
        return new Array(outputs).fill(0);
    }
    let binary = [];
    while (number > 0) {
        binary.unshift(number % 2); // unshift instead of push to add binary digits from left to right
        number = Math.floor(number / 2);
    }
    while (binary.length < 8) {
        binary.unshift(0); // add leading 0's to pad the binary number to 8 digits
    }
  
    return binary;
};

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

export const addPadding = (list) => {
    const paddedList = list;
    const paddingToAdd = 64 - paddedList.length;
    for (let j = 0; j < paddingToAdd; j++) {
        paddedList.push(0);
    }
    return paddedList;
};