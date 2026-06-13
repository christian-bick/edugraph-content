import "./exercise.scss";
import { RenderPayload } from "../../types/ml-engine.ts";

const operatorSymbols: { [key: string]: string } = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷'
};

function createProblemHTML(
    data: { num1: number, num2: number, answer: number, operator: string },
    isAnswerView: boolean
) {
    const symbol = operatorSymbols[data.operator] || '?';

    return `
        <div class="problem">
            <span class="number">${data.num1}</span>
            <span class="number">
                <span class="operator">${symbol}</span>${data.num2}
            </span>
            <div class="line"></div>
            <div class="answer-box ${isAnswerView ? 'solution' : ''}">${isAnswerView ? data.answer : ''}</div>
        </div>`;
}

window.renderExercise = (payload: RenderPayload) => {
    const exerciseContainer = document.getElementById('exercise');
    
    if (exerciseContainer) {
        const { problem, isAnswerView } = payload;
        
        exerciseContainer.innerHTML = createProblemHTML(problem.data as any, isAnswerView);

        const answerContainer = document.getElementById('answer');
        if (answerContainer) {
            answerContainer.style.display = 'none';
        }
    }
};
