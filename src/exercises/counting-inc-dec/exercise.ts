import "./exercise.scss";
import { RenderPayload } from "../../types/ml-engine.ts";

const ICONS = ['circle.svg', 'square.svg', 'triangle.svg', 'star.svg', 'pentagon.svg', 'hexagon.svg', 'heart.svg', 'diamond.svg'];

function createProblemHTML(data: { numObjects: number, icon: string, type: string, answer: number }, showAnswer: boolean) {
    const objectsHTML = Array(data.numObjects).fill(`<img src="/icons/counting/${data.icon}" alt="counting object">`).join('');
    const isInc = data.type === 'inc';
    const arrowClass = isInc ? 'triangle-up' : 'triangle-down';
    const textClass = isInc ? 'up' : 'down';
    
    return `
        <div class="problem">
            <div class="objects-container">${objectsHTML}</div>
            <div class="answer-container">
                <div class="arrow-wrapper">
                    <div class="${arrowClass}"></div>
                    <span class="arrow-text ${textClass}">1</span>
                </div>
                <div class="answer-box ${showAnswer ? 'solution' : ''}">${showAnswer ? data.answer : ''}</div>
            </div>
        </div>`;
}

window.renderExercise = (payload: RenderPayload) => {
    const exerciseContainer = document.getElementById('exercise');
    
    if (exerciseContainer) {
        const { problem, isAnswerView } = payload;
        
        const iconIndex = Array.from(problem.id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % ICONS.length;
        const icon = ICONS[iconIndex];
        
        const problemData = {
            numObjects: problem.data.numObjects,
            icon: icon,
            type: problem.data.incDecType,
            answer: problem.data.incDecAnswer
        };

        exerciseContainer.innerHTML = createProblemHTML(problemData, isAnswerView);

        const answerContainer = document.getElementById('answer');
        if (answerContainer) {
            answerContainer.style.display = 'none';
        }
    }
};
