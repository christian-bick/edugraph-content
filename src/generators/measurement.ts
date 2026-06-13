import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";

export class MeasurementGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'measurement';
    compatibleRenderers = ['measure-length'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;
        const bandLength = constraints.bandLength || 20;

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
            attempts++;
            
            const minProblemLength = bandLength * 0.1; // Allows a bit more variety than 0.25
            const problemLength = parseFloat((random() * (bandLength - minProblemLength) + minProblemLength).toFixed(1));
            
            const problemKey = `${bandLength}_${problemLength}`;
            
            if (!existingKeys.has(problemKey)) {
                existingKeys.add(problemKey);
                
                const tags = [];
                if (problemLength % 1 !== 0) tags.push('has_decimals');
                
                generatedProblems.push({
                    id: `measure-${generatedProblems.length + 1}-${problemKey}`,
                    type: this.type,
                    data: {
                        bandLength: bandLength,
                        problemLength: problemLength
                    },
                    tags: tags
                });
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique measurement problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
