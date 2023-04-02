import { charToBinary } from "./utility.js";

  
const formatQuestionAndAnswerList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let eq = list[i];
        let equation1 = [];
        for (let j = 0; j < eq.length; j++) {
            let char = eq[j];
            let binary = charToBinary(char);
            equation1.push(binary);
        }
        list[i] = equation1;
    }
    return list;
};

export const generateQuestionAndAnswers = () => {
    let questions = [];
    let answers = [];    

    for (let i = 0; i < 10; i++) {
        let a = Math.floor(Math.random() * 10) + 1;
        let equation1 = "";
        
        // random numbe from 0 - 3 and depending on the number, the operation changes
        let operation = Math.floor(Math.random() * 4);
        switch (operation) {
            case 0:
                let b = a * (Math.floor(Math.random() * 10) + 1);
                equation1 = `${a}x=${b}`;
                questions.push(equation1);
                answers.push(`${b / a}`);
                break;
            case 1:
                let b1 = a + (Math.floor(Math.random() * 10) + 1);
                equation1 = `$x+${a}=${b1}`;
                questions.push(equation1);
                answers.push(`${b1 - a}`);
                console.log(equation1, b1 - a);
                break;
            case 2:
                let b2 = a - (Math.floor(Math.random() * 10) + 1);
                equation1 = `${a}x-${b2}=${b2}`;
                questions.push(equation1);
                answers.push(`${b2 + a}`);
                break;
            case 3:
                let b3 = a * (Math.floor(Math.random() * 10) + 1);
                equation1 = `$x/${a}=${b3}`;
                questions.push(equation1);
                answers.push(`${b3 * a}`);
                break;
        }

    };
    return [
        formatQuestionAndAnswerList(questions),
        formatQuestionAndAnswerList(answers)
    ];
};
