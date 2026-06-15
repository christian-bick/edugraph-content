import { ArithmeticGenerator } from '../generators/arithmetic/generator.ts';
import { CountingGenerator } from '../generators/counting/generator.ts';
import { MeasurementGenerator } from '../generators/measurement/generator.ts';
import { ComparisonGenerator } from '../generators/comparison/generator.ts';
import { OrderingGenerator } from '../generators/ordering/generator.ts';
import { WritingGenerator } from '../generators/writing/generator.ts';
import { TimeGenerator } from '../generators/time/generator.ts';

import { ProblemGenerator } from '../types/ml-engine.ts';

export interface ModuleConfig {
    generatorClass: new () => ProblemGenerator;
    compatibleViews: string[];
}

export const DatasetConfig: { modules: Record<string, ModuleConfig> } = {
    modules: {
        arithmetic: {
            generatorClass: ArithmeticGenerator,
            compatibleViews: ['operations-vertical', 'operations-boxes']
        },
        counting: {
            generatorClass: CountingGenerator,
            compatibleViews: ['counting-objects', 'counting-inc-dec']
        },
        measurement: {
            generatorClass: MeasurementGenerator,
            compatibleViews: ['measure-length']
        },
        comparison: {
            generatorClass: ComparisonGenerator,
            compatibleViews: ['numbers-compare']
        },
        ordering: {
            generatorClass: OrderingGenerator,
            compatibleViews: ['numbers-order']
        },
        writing: {
            generatorClass: WritingGenerator,
            compatibleViews: ['numbers-write']
        },
        time: {
            generatorClass: TimeGenerator,
            compatibleViews: ['time-analog']
        }
    }
};
