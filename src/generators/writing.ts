import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";

export class WritingGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'arithmetic'; // Keeping simple type or maybe 'counting'
    compatibleRenderers = ['numbers-write'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;

        // The only constraint is number from 1 to 9 (or based on constraints)
        const minNum = constraints.min || 1;
        const maxNum = constraints.max || 9;
        
        let currentNum = minNum;

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
            attempts++;
            
            const problemKey = `${currentNum}`;

            if (!existingKeys.has(problemKey)) {
                existingKeys.add(problemKey);
                
                generatedProblems.push({
                    id: `write-${generatedProblems.length + 1}-${problemKey}`,
                    type: 'counting', // Just reuse existing type
                    data: {
                        number: currentNum
                    },
                    tags: []
                });
            }
            
            currentNum++;
            if (currentNum > maxNum) {
                currentNum = minNum;
                // If we've generated all possible numbers, we can't generate more unique ones
                if (generatedProblems.length === maxNum - minNum + 1) {
                    break;
                }
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique writing problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
