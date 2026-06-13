import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";
import { Area, Scope, Ability } from "edugraph-ts";

export class TimeGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'time';
    compatibleRenderers = ['time-analog'];

    private generateLabels(params: { [key: string]: any }) {
        const interval = params.interval || 3600;
        let intervalScope;
        if (interval < 60) {
            intervalScope = Scope.SecondIntervals
        } else if (interval < 3600) {
            intervalScope = Scope.MinuteIntervals
        } else {
            intervalScope = Scope.HourIntervals
        }
        return {
            Area: [Area.MeasuringTime],
            Scope: [Scope.AnalogClock, intervalScope],
            Ability: [Ability.ProcedureApplication, Ability.ProcedureExecution],
        }
    }

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { permutations, countPerPermutation = 1 } = config;
        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        for (const params of permutations) {
            const interval = params.interval || 3600;

            const labels = this.generateLabels(params);
            const tags = [
                ...labels.Area,
                ...labels.Scope,
                ...labels.Ability
            ];

            let countForThisPerm = 0;
            let attempts = 0;
            const maxAttempts = countPerPermutation * 50;
            const dayInSeconds = 24 * 3600;

            while (countForThisPerm < countPerPermutation && attempts < maxAttempts) {
                attempts++;
                
                const maxIntervals = Math.floor(dayInSeconds / interval);
                const randomInterval = Math.floor(random() * maxIntervals);
                const totalSeconds = randomInterval * interval;

                const hour = Math.floor(totalSeconds / 3600);
                const remainingSeconds = totalSeconds % 3600;
                const minute = Math.floor(remainingSeconds / 60);
                const second = remainingSeconds % 60;

                const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
                
                const problemKey = `${interval}_${timeStr}`;
                
                if (!existingKeys.has(problemKey)) {
                    existingKeys.add(problemKey);
                    countForThisPerm++;
                    
                    if (hour >= 12) tags.push('pm');
                    else tags.push('am');
                    
                    generatedProblems.push({
                        id: `time-${generatedProblems.length + 1}-${problemKey.replace(/:/g, '-')}`,
                        type: this.type,
                        data: {
                            time: timeStr,
                            interval: interval,
                            _permutationParams: params 
                        },
                        tags: [...tags] // copy to avoid modifying base tags
                    });
                }
            }
        }

        return generatedProblems;
    }
}
