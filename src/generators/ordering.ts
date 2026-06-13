import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export class OrderingGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'ordering';
    compatibleRenderers = ['numbers-order'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;
        const includesZero = constraints.includesZero !== false;
        
        const numberSet = includesZero
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            : [1, 2, 3, 4, 5, 6, 7, 8, 9];

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
            attempts++;
            
            const shuffled = shuffleArray(numberSet);
            const selectedNumbers = shuffled.slice(0, 5);
            const problemKey = selectedNumbers.join(',');

            if (!existingKeys.has(problemKey)) {
                existingKeys.add(problemKey);
                
                const tags = [];
                if (selectedNumbers.includes(0)) tags.push('has_zero');
                
                generatedProblems.push({
                    id: `order-${generatedProblems.length + 1}-${problemKey.replace(/,/g, '-')}`,
                    type: this.type,
                    data: {
                        numbers: selectedNumbers
                    },
                    tags: tags
                });
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique ordering problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
