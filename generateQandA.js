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
    };
    return [
        formatQuestionAndAnswerList(questions),
        formatQuestionAndAnswerList(answers)
    ];
};
