import { describe, it, expect, beforeEach } from 'vitest';
import { OrderingGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability, Area, Scope } from 'edugraph-ts';

describe('OrderingGenerator', () => {
    let generator: OrderingGenerator;

    beforeEach(() => {
        generator = new OrderingGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('ordering');
        expect(generator.compatibleRenderers).toContain('numbers-order');
    });

    describe('generateLabels', () => {
        it('should generate labels for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const labels = generator.generateLabels(params);
                expect(labels).toContain(Area.NumerationWithIntegers);
                expect(labels).toContain(Ability.ProcedureExecution);
                if (params.includesZero) {
                    expect(labels).toContain(Scope.NumbersWithZero);
                } else {
                    expect(labels).toContain(Scope.NumbersWithoutZero);
                }
            });
        });
    });

    describe('generate', () => {
        it('should generate valid problem stubs for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.id).toBeDefined();
                    expect(stub.data.numbers).toBeInstanceOf(Array);
                    expect(stub.data.numbers.length).toBe(5);
                    if (!params.includesZero) {
                        expect(stub.data.numbers).not.toContain(0);
                    }
                    // Verify uniqueness in the set
                    expect(new Set(stub.data.numbers).size).toBe(5);
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
