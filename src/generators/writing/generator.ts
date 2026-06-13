import { ProblemGenerator, AbstractProblem } from "../../types/ml-engine.ts";
import { random } from "../../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class WritingGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'writing';
    compatibleRenderers = ['numbers-write'];

    generateLabels(params: Record<string, any>): string[] {
        return [
            Area.IntegerNotation,
            Scope.ArabicNumerals, Scope.Base10, Scope.NumbersSmaller10, Scope.NumbersWithoutZero,
            Ability.ProcedureExecution
        ];
    }

    generate(params: Record<string, any>): Omit<AbstractProblem, "tags" | "type"> | null {
        const minNum = params.min || 1;
        const maxNum = params.max || 9;
        const fixedNumber = params.number;

        const currentNum = fixedNumber !== undefined ? fixedNumber : Math.floor(random() * (maxNum - minNum + 1)) + minNum;
        
        return {
            id: `${currentNum}`,
            data: {
                number: currentNum
            }
        };
    }
}
