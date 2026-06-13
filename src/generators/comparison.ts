import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class ComparisonGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'comparison';
    compatibleRenderers = ['numbers-compare'];

    private generateLabels(params: { [key: string]: any }) {
        let scope;
        if (params.digits === 1) scope = Scope.NumbersSmaller10;
        else if (params.digits === 2) scope = Scope.NumbersSmaller100;
        else scope = Scope.NumbersSmaller1000;

        return {
            Area: [Area.NumerationWithIntegers],
            Ability: [Ability.ProcedureApplication, Ability.ProcedureExecution],
            Scope: [Scope.ArabicNumerals, Scope.Base10, scope, params.includesZero ? Scope.NumbersWithZero : Scope.NumbersWithoutZero],
        };
    }

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { permutations, countPerPermutation = 1 } = config;
        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        for (const params of permutations) {
            const digits = params.digits || 1;
            const includesZero = params.includesZero !== false;

            const labels = this.generateLabels(params);
            const tags = [
                ...labels.Area,
                ...labels.Scope,
                ...labels.Ability
            ];

            let countForThisPerm = 0;
            let attempts = 0;
            const maxAttempts = countPerPermutation * 50;

            const max = Math.pow(10, digits) - 1;
            let min = digits > 1 ? Math.pow(10, digits - 1) : 0;
            if (!includesZero && digits === 1) {
                min = 1;
            }

            while (countForThisPerm < countPerPermutation && attempts < maxAttempts) {
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
                    countForThisPerm++;
                    
                    generatedProblems.push({
                        id: `compare-${generatedProblems.length + 1}-${problemKey}`,
                        type: this.type,
                        data: {
                            num1: num1,
                            num2: num2,
                            answer: answer,
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
