import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";

export class CountingGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'counting';
    compatibleRenderers = ['counting-objects', 'counting-inc-dec'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;
        const maxCount = constraints.maxCount || 10;
        const allowIncDec = constraints.allowIncDec !== false;

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
            attempts++;
            
            const minCount = Math.max(1, maxCount - 9); 
            const numObjects = Math.floor(random() * (maxCount - minCount + 1)) + minCount;
            
            // For simple counting, the answer is the number of objects.
            // For inc/dec, the answer is numObjects +/- 1.
            // We can generate abstract problems that could be rendered as either.
            
            const isInc = random() < 0.5;
            const incDecType = isInc ? 'inc' : 'dec';
            
            // Ensure we don't decrement below 1
            if (incDecType === 'dec' && numObjects <= 1) {
                continue; 
            }

            const incDecAnswer = isInc ? numObjects + 1 : numObjects - 1;
            
            const problemKey = `${numObjects}_${incDecType}`;
            
            if (!existingKeys.has(problemKey)) {
                existingKeys.add(problemKey);
                
                const tags = [];
                if (numObjects >= 10) tags.push('double_digit_stimulus');
                
                generatedProblems.push({
                    id: `counting-${generatedProblems.length + 1}-${problemKey}`,
                    type: this.type,
                    data: {
                        numObjects: numObjects,
                        incDecType: incDecType,
                        incDecAnswer: incDecAnswer,
                        simpleAnswer: numObjects
                    },
                    tags: tags
                });
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique counting problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
