import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

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

    private generateLabels(params: { [key: string]: any }) {
        return {
            Area: [Area.NumerationWithIntegers],
            Ability: [Ability.ProcedureApplication, Ability.ProcedureExecution],
            Scope: [Scope.ArabicNumerals, Scope.Base10, Scope.NumbersSmaller10, params.includesZero === 'true' || params.includesZero === true ? Scope.NumbersWithZero : Scope.NumbersWithoutZero],
        };
    }

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { permutations, countPerPermutation = 1 } = config;
        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        for (const params of permutations) {
            const includesZero = params.includesZero === 'true' || params.includesZero === true;
            
            const numberSet = includesZero
                ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                : [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
                
                const shuffled = shuffleArray(numberSet);
                const selectedNumbers = shuffled.slice(0, 5);
                const problemKey = selectedNumbers.join(',');

                if (!existingKeys.has(problemKey)) {
                    existingKeys.add(problemKey);
                    countForThisPerm++;
                    
                    generatedProblems.push({
                        id: `order-${generatedProblems.length + 1}-${problemKey.replace(/,/g, '-')}`,
                        type: this.type,
                        data: {
                            numbers: selectedNumbers,
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
