import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { generateAddition, generateSubtraction, generateMultiplication, generateDivision } from "../lib/arithmetic-problems.ts";
import { random } from "../lib/random.ts";

export class ArithmeticGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'arithmetic';
    compatibleRenderers = ['operations-boxes-single', 'operations-boxes', 'operations-vertical'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;
        const operations = constraints.operations || ['add'];
        const digitsNum1 = constraints.digitsNum1;
        const digitsNum2 = constraints.digitsNum2;
        const maxDigits = constraints.maxDigits || 5;
        const allowNegatives = constraints.allowNegatives || false;

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
            attempts++;
            const op = operations[Math.floor(random() * operations.length)];
            
            const numberGenParams = { digitsNum1, digitsNum2, maxDigits, allowNegatives };
            let mathProblem;
            
            switch (op) {
                case 'subtract': mathProblem = generateSubtraction(numberGenParams); break;
                case 'multiply': mathProblem = generateMultiplication(numberGenParams); break;
                case 'divide': mathProblem = generateDivision(numberGenParams); break;
                case 'add':
                default: mathProblem = generateAddition(numberGenParams); break;
            }

            const problemKey = `${mathProblem.num1},${op},${mathProblem.num2}`;
            
            if (!existingKeys.has(problemKey)) {
                existingKeys.add(problemKey);
                
                const tags = [];
                if (mathProblem.num1 === 0 || mathProblem.num2 === 0) tags.push('has_zero');
                if (mathProblem.answer < 0) tags.push('negative_result');
                // Could add more sophisticated tags here like 'requires_carry'
                
                generatedProblems.push({
                    id: `arithmetic-${generatedProblems.length + 1}-${problemKey}`,
                    type: this.type,
                    data: {
                        num1: mathProblem.num1,
                        num2: mathProblem.num2,
                        answer: mathProblem.answer,
                        operator: op
                    },
                    tags: tags
                });
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
