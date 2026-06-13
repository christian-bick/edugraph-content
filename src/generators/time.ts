import { ProblemGenerator, DatasetGenerationConfig, AbstractProblem } from "../types/ml-engine.ts";
import { random } from "../lib/random.ts";

export class TimeGenerator implements ProblemGenerator {
    type: AbstractProblem['type'] = 'time';
    compatibleRenderers = ['time-analog'];

    generateDataset(config: DatasetGenerationConfig): AbstractProblem[] {
        const { totalCount, constraints } = config;
        const interval = constraints.interval || 3600; // Default to hour

        const generatedProblems: AbstractProblem[] = [];
        const existingKeys = new Set<string>();

        let attempts = 0;
        const maxAttempts = totalCount * 10;
        const dayInSeconds = 24 * 3600;

        while (generatedProblems.length < totalCount && attempts < maxAttempts) {
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
                
                const tags = [];
                if (hour >= 12) tags.push('pm');
                else tags.push('am');
                
                generatedProblems.push({
                    id: `time-${generatedProblems.length + 1}-${problemKey.replace(/:/g, '-')}`,
                    type: this.type,
                    data: {
                        time: timeStr,
                        interval: interval
                    },
                    tags: tags
                });
            }
        }

        if (generatedProblems.length < totalCount) {
            console.warn(`Could only generate ${generatedProblems.length} unique time problems out of requested ${totalCount}. Constraints may be too tight.`);
        }

        return generatedProblems;
    }
}
