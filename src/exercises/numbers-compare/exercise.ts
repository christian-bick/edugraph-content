import "./exercise.scss";
import { RenderPayload } from "../../types/ml-engine.ts";

function createProblemHTML(data: { num1: number, num2: number, answer: string }, isAnswerView: boolean) {
    return `
        <div class="problem">
            <span class="number">${data.num1}</span>
            <span class="answer-box ${isAnswerView ? 'solution' : ''}">${isAnswerView ? data.answer : ''}</span>
            <span class="number">${data.num2}</span>
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
