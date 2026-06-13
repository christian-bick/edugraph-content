import { ProblemGenerator, AbstractProblem } from "../../types/ml-engine.ts";
import { random } from "../../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class CountingGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'counting';
    compatibleRenderers = ['counting-objects', 'counting-inc-dec'];

    generateLabels(params: Record<string, any>): string[] {
        const count = params.maxCount || params.count || 10;
        const scopes = [
            Scope.ArabicNumerals,
            Scope.Base10,
            Scope.NumbersWithoutZero,
            Scope.NumbersWithoutNegatives,
            Scope.CountingSymbols,
            count <= 10 ? Scope.NumbersSmaller10 : Scope.NumbersSmaller20
        ];

        const areas = [Area.NumerationWithIntegers];
        if (!params.type) {
            areas.push(Area.IntegerNotation);
        }

        const abilities = [Ability.ProcedureExecution];
        if (params.type === 'inc' || params.type === 'dec') {
            abilities.push(Ability.ProcedureApplication);
        }

        return [...areas, ...scopes, ...abilities];
    }

    generate(params: Record<string, any>): Omit<AbstractProblem, 'tags' | 'type'> {
        const maxCount = params.maxCount || params.count || 10;
        const incDecType = params.type; 
        
        const minCount = Math.max(1, maxCount - 9); 
        const numObjects = Math.floor(random() * (maxCount - minCount + 1)) + minCount;
        
        // Handle invalid states for decrement (cannot decrement 1 objects in this context)
        if (incDecType === 'dec' && numObjects <= 1) {
            return null;
        }

        let incDecAnswer = undefined;
        if (incDecType === 'inc') incDecAnswer = numObjects + 1;
        if (incDecType === 'dec') incDecAnswer = numObjects - 1;
        
        const problemKey = `${numObjects}_${incDecType || 'simple'}`;
        
        return {
            id: problemKey,
            data: {
                numObjects: numObjects,
                incDecType: incDecType,
                incDecAnswer: incDecAnswer,
                simpleAnswer: numObjects
            }
        };
    }
}
