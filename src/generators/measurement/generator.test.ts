import { describe, it, expect, beforeEach } from 'vitest';
import { MeasurementGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability, Area, Scope } from 'edugraph-ts';

describe('MeasurementGenerator', () => {
    let generator: MeasurementGenerator;

    beforeEach(() => {
        generator = new MeasurementGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('measurement');
        expect(generator.compatibleRenderers).toContain('measure-length');
    });

    describe('generateLabels', () => {
        it('should generate labels', () => {
            const labels = generator.generateLabels({});
            expect(labels).toContain(Area.MeasuringObjects);
            expect(labels).toContain(Scope.CentimeterScale);
            expect(labels).toContain(Ability.ProcedureApplication);
        });
    });

    describe('generate', () => {
        it('should generate valid problem stubs for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.id).toBeDefined();
                    expect(stub.data.bandLength).toBe(params.bandLength);
                    expect(stub.data.problemLength).toBeGreaterThan(0);
                    expect(stub.data.problemLength).toBeLessThanOrEqual(params.bandLength);
                }
            });
        });

        it('should be deterministic with the same seed', () => {
            const params = config.generationConfig.permutations[0];
            setSeed(123);
            const stub1 = generator.generate(params);
            setSeed(123);
            const stub2 = generator.generate(params);
            expect(stub1).toEqual(stub2);
        });
    });
});
