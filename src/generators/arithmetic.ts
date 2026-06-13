import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { generateAddition, generateSubtraction, generateMultiplication, generateDivision } from "../lib/arithmetic-problems.ts";
import { random } from "../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";
import { numScopes, withNegativesScope } from "../lib/labels.ts";

export class ArithmeticGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'arithmetic';
    compatibleRenderers = ['operations-boxes', 'operations-vertical'];

    private generateLabels(params: { [key: string]: any }) {
        const scopes = [
            Scope.ArabicNumerals,
            Scope.Base10,
            params.includeZero ? Scope.NumbersWithZero : Scope.NumbersWithoutZero,
            withNegativesScope(params.allowNegatives),
            ...numScopes([params.digitsNum1 || (params.includeTenCarry ? 2 : 1), params.digitsNum2 || 1]),
        ];

        const opStr = params.operations || 'add';
        const areas = opStr.split(',').map((op: string) => {
            const mapping: { [key: string]: Area } = {
                add: Area.IntegerAddition,
                subtract: Area.IntegerSubtraction,
                divide: Area.IntegerDivision,
                multiply: Area.IntegerMultiplication
            };
            return mapping[op];
        });

        const abilities = [Ability.ProcedureApplication];

        return {
            Area: areas,
            Scope: scopes,
            Ability: abilities,
        };
    }

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { permutations, countPerPermutation = 1 } = config;
        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        for (const params of permutations) {
            // Unpack params provided by the ML Orchestrator (originally from PermutationBuilder)
            const operations = params.operations ? params.operations.split(',') : ['add'];
            const digitsNum1 = params.digitsNum1;
            const digitsNum2 = params.digitsNum2;
            const maxDigits = params.maxDigits || 5;
            const allowNegatives = params.allowNegatives === true || params.allowNegatives === 'true';

            // Generate ontological tags for this specific permutation
            const labels = this.generateLabels(params);
            // Flatten labels into a string array for the ML abstract problem
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

                // Make the key unique for this mathematical problem
                const problemKey = `${mathProblem.num1},${op},${mathProblem.num2}`;
                
                if (!existingKeys.has(problemKey)) {
                    existingKeys.add(problemKey);
                    countForThisPerm++;
                    
                    // We attach the full parameter object so the visual blueprint can use it
                    generatedProblems.push({
                        id: `arithmetic-${generatedProblems.length + 1}-${problemKey}`,
                        type: this.type,
                        data: {
                            num1: mathProblem.num1,
                            num2: mathProblem.num2,
                            answer: mathProblem.answer,
                            operator: op,
                            // Pass the permutation params down so the visual layer knows 
                            // e.g., what 'blankPart' was requested for this specific problem
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
