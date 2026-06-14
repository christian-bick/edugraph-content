import { describe, it, expect, beforeEach } from 'vitest';
import { CountingGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability, Area, Scope } from 'edugraph-ts';

describe('CountingGenerator', () => {
    let generator: CountingGenerator;

    beforeEach(() => {
        generator = new CountingGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('counting');
        expect(generator.compatibleRenderers).toContain('counting-objects');
        expect(generator.compatibleRenderers).toContain('counting-inc-dec');
    });

    describe('generateLabels', () => {
        it('should generate labels for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const labels = generator.generateLabels(params);
                expect(labels).toBeInstanceOf(Array);
                expect(labels.length).toBeGreaterThan(0);
                expect(labels).toContain(Area.NumerationWithIntegers);
                expect(labels).toContain(Scope.CountingSymbols);
                
                if (params.type === 'inc' || params.type === 'dec') {
                    expect(labels).toContain(Ability.ProcedureApplication);
                } else {
                    expect(labels).toContain(Area.IntegerNotation);
                }
            });
        });
    });

    describe('generate', () => {
        it('should generate valid problem stubs or null for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.id).toBeDefined();
                    expect(stub.data).toBeDefined();
                    expect(stub.data.numObjects).toBeGreaterThanOrEqual(1);
                    expect(stub.data.incDecType).toBe(params.type);
                    
                    if (params.type === 'inc') {
                        expect(stub.data.incDecAnswer).toBe(stub.data.numObjects + 1);
                    } else if (params.type === 'dec') {
                        expect(stub.data.incDecAnswer).toBe(stub.data.numObjects - 1);
                        expect(stub.data.numObjects).toBeGreaterThan(1);
                    }
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

    describe('generate edge cases', () => {
        it('should return null when attempting to decrement 1 object', () => {
            // We force a scenario where numObjects is likely to be 1
            // By setting maxCount to 1, minCount becomes 1, and numObjects must be 1.
            const params = { type: 'dec', maxCount: 1 };
            const stub = generator.generate(params);
            expect(stub).toBeNull();
        });

        it('should never return more than maxCount objects', () => {
            const params = { maxCount: 5 };
            for (let i = 0; i < 50; i++) {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.data.numObjects).toBeLessThanOrEqual(5);
                }
            }
        });
    });
});
