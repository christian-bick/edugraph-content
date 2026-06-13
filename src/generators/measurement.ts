import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class MeasurementGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'measurement';
    compatibleRenderers = ['measure-length'];

    private generateLabels(params: { [key: string]: any }) {
        return {
            Area: [Area.MeasuringObjects, Area.DigitNotation],
            Ability: [Ability.ProcedureApplication, Ability.ProcedureExecution],
            Scope: [Scope.CentimeterScale, Scope.MillimeterScale, Scope.Tapemeter],
        };
    }

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { permutations, countPerPermutation = 1 } = config;
        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        for (const params of permutations) {
            const bandLength = params.bandLength || 20;

            const labels = this.generateLabels(params);
            const tags = [
                ...labels.Area,
                ...labels.Scope,
                ...labels.Ability
            ];

            let countForThisPerm = 0;
            let attempts = 0;
            const maxAttempts = countPerPermutation * 50;

            while (countForThisPerm < countPerPermutation && attempts < maxAttempts) {
                attempts++;
                
                const minProblemLength = bandLength * 0.1;
                const problemLength = parseFloat((random() * (bandLength - minProblemLength) + minProblemLength).toFixed(1));
                
                const problemKey = `${bandLength}_${problemLength}`;
                
                if (!existingKeys.has(problemKey)) {
                    existingKeys.add(problemKey);
                    countForThisPerm++;
                    
                    generatedProblems.push({
                        id: `measure-${generatedProblems.length + 1}-${problemKey.replace('.', '-')}`,
                        type: this.type,
                        data: {
                            bandLength: bandLength,
                            problemLength: problemLength,
                            _permutationParams: params 
                        },
                        tags: tags
                    });
                }
            }
        }

        return generatedProblems;
    }
}
