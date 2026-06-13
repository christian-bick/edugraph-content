import { ProblemGenerator, AbstractProblem } from "../../types/ml-engine.ts";
import { random } from "../../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class MeasurementGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'measurement';
    compatibleRenderers = ['measure-length'];

    generateLabels(params: Record<string, any>): string[] {
        return [
            Area.MeasuringObjects, Area.DigitNotation,
            Scope.CentimeterScale, Scope.MillimeterScale, Scope.Tapemeter,
            Ability.ProcedureApplication, Ability.ProcedureExecution
        ];
    }

    generate(params: Record<string, any>): Omit<AbstractProblem, "tags" | "type"> | null {
        const bandLength = params.bandLength || 20;
        const minProblemLength = bandLength * 0.1;
        const problemLength = parseFloat((random() * (bandLength - minProblemLength) + minProblemLength).toFixed(1));
        
        const problemKey = `${bandLength}_${problemLength}`;
        
        return {
            id: problemKey.replace('.', '-'),
            data: {
                bandLength: bandLength,
                problemLength: problemLength
            }
        };
    }
}
