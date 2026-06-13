import { ProblemGenerator, AbstractProblem } from "../../types/ml-engine.ts";
import { random } from "../../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class TimeGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'time';
    compatibleRenderers = ['time-analog'];

    generateLabels(params: Record<string, any>): string[] {
        const interval = params.interval || 3600;
        let intervalScope;
        if (interval < 60) {
            intervalScope = Scope.SecondIntervals
        } else if (interval < 3600) {
            intervalScope = Scope.MinuteIntervals
        } else {
            intervalScope = Scope.HourIntervals
        }
        return [
            Area.MeasuringTime,
            Scope.AnalogClock, intervalScope,
            Ability.ProcedureApplication, Ability.ProcedureExecution
        ];
    }

    generate(params: Record<string, any>): Omit<AbstractProblem, "tags" | "type"> | null {
        const interval = params.interval || 3600;
        const dayInSeconds = 24 * 3600;

        const maxIntervals = Math.floor(dayInSeconds / interval);
        const randomInterval = Math.floor(random() * maxIntervals);
        const totalSeconds = randomInterval * interval;

        const hour = Math.floor(totalSeconds / 3600);
        const remainingSeconds = totalSeconds % 3600;
        const minute = Math.floor(remainingSeconds / 60);
        const second = remainingSeconds % 60;

        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        
        const problemKey = `${interval}_${timeStr.replace(/:/g, '-')}`;
        
        return {
            id: problemKey,
            data: {
                time: timeStr,
                interval: interval
            }
        };
    }
}
