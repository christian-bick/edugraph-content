import "./exercise.scss";
import { RenderPayload } from "../../types/ml-engine.ts";

function createMeasureBand(bandLength: number): string {
    let markers = '';
    for (let i = 0; i <= bandLength; i++) {
        markers += `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="20" stroke="black" stroke-width="1"/>`;
        markers += `<text x="${i * 30}" y="40" text-anchor="middle" font-size="12">${i}</text>`;

        if (i < bandLength) {
            for (let j = 1; j < 10; j++) {
                const y2 = (j === 5) ? 14 : 10;
                markers += `<line x1="${i * 30 + j * 3}" y1="0" x2="${i * 30 + j * 3}" y2="${y2}" stroke="black" stroke-width="0.5"/>`;
            }
        }
    }

    return `
        <svg class="measure-band" viewBox="0 0 ${bandLength * 30} 50" width="${bandLength * 30}" height="50">
            <rect x="0" y="0" width="${bandLength * 30}" height="20" fill="#f0f0f0" stroke="black" stroke-width="1"/>
            ${markers}
        </svg>
    `;
}

function createRectangle(length: number, color: string): string {
    const rectHeight = 20;
    const displayLength = length * 30;

    return `
        <svg class="measured-rectangle" viewBox="0 0 ${displayLength} ${rectHeight}" width="${displayLength}" height="${rectHeight}">
            <rect x="0" y="0" width="${displayLength}" height="${rectHeight}" fill="${color}"/>
        </svg>
    `;
}

function createProblemHTML(data: any, visualParams: any, color: string, isAnswerView: boolean) {
    const isReverse = visualParams.reverse === true || visualParams.reverse === 'true';
    const isDecimal = visualParams.decimal === true || visualParams.decimal === 'true';

    const measureBandHTML = createMeasureBand(data.bandLength);
    
    const showRectangle = !isReverse || isAnswerView;
    const showAnswerInBox = isReverse || isAnswerView;
    const isTextSolution = !isReverse && isAnswerView;

    const rectColor = isReverse ? 'forestgreen' : color;
    const rectangleHTML = showRectangle ? createRectangle(data.problemLength, rectColor) : `<div style="height: 22px; width: ${data.problemLength * 30}px"></div>`;

    const answer = isDecimal ? (data.problemLength).toFixed(1) : (data.problemLength * 10).toFixed(0);
    const unit = isDecimal ? 'cm' : 'mm';

    let answerBoxClasses = 'answer-box';
    if (isReverse) answerBoxClasses += ' reverse';
    if (isTextSolution) answerBoxClasses += ' solution';

    return `
        <div class="problem">
            <div class="measurement-container">
                ${rectangleHTML}
                ${measureBandHTML}
            </div>
            <div class="${answerBoxClasses}" data-unit="${unit}">${showAnswerInBox ? answer : ''}</div>
        </div>`;
}

window.renderExercise = (payload: RenderPayload) => {
    const exerciseContainer = document.getElementById('exercise');
    
    if (exerciseContainer) {
        const { problem, config, isAnswerView } = payload;
        const color = '#4682B4'; // SteelBlue
        
        exerciseContainer.innerHTML = createProblemHTML(problem.data, config.visualParams, color, isAnswerView);

        const answerContainer = document.getElementById('answer');
        if (answerContainer) {
            answerContainer.style.display = 'none';
        }
    }
};
