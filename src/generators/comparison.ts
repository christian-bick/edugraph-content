import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";

export class ComparisonGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'comparison';
    compatibleRenderers = ['numbers-compare'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;
        const digits = constraints.digits || 1;
        const includesZero = constraints.includesZero !== false;

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;

        const max = Math.pow(10, digits) - 1;
        let min = digits > 1 ? Math.pow(10, digits - 1) : 0;
        if (!includesZero && digits === 1) {
            min = 1;
        }

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
            attempts++;
            
            const num1 = Math.floor(random() * (max - min + 1)) + min;
            const num2 = Math.floor(random() * (max - min + 1)) + min;

            if (num1 === num2) {
                continue;
            }

            const answer = num1 > num2 ? '>' : '<';
            const problemKey = `${num1}_${num2}`;
            
            if (!existingKeys.has(problemKey)) {
                existingKeys.add(problemKey);
                
                const tags = [];
                if (num1 === 0 || num2 === 0) tags.push('has_zero');
                
                generatedProblems.push({
                    id: `compare-${generatedProblems.length + 1}-${problemKey}`,
                    type: this.type,
                    data: {
                        num1: num1,
                        num2: num2,
                        answer: answer
                    },
                    tags: tags
                });
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique comparison problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
