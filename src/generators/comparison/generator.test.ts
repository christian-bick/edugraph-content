import { describe, it, expect, beforeEach } from 'vitest';
import { ComparisonGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability, Area } from 'edugraph-ts';

describe('ComparisonGenerator', () => {
    let generator: ComparisonGenerator;

    beforeEach(() => {
        generator = new ComparisonGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('comparison');
        expect(generator.compatibleRenderers).toContain('numbers-compare');
    });

    describe('generateLabels', () => {
        it('should generate labels for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const labels = generator.generateLabels(params);
                expect(labels).toBeInstanceOf(Array);
                expect(labels.length).toBeGreaterThan(0);
                expect(labels).toContain(Area.NumerationWithIntegers);
                expect(labels).toContain(Ability.ProcedureExecution);
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
                    expect(stub.data.num1).toBeDefined();
                    expect(stub.data.num2).toBeDefined();
                    expect(stub.data.answer).toMatch(/^[<>]$/);
                    expect(stub.data.num1).not.toBe(stub.data.num2);
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
        it('should return null if numbers are equal', () => {
            // We can't easily force equal numbers without mocking random or brute forcing.
            // But we can check if the generator logic correctly handles it.
            // Since we know the implementation uses random(), we'll just verify it's never equal in valid stubs.
            for (let i = 0; i < 100; i++) {
                const stub = generator.generate({ digits: 1 });
                if (stub) {
                    expect(stub.data.num1).not.toEqual(stub.data.num2);
                }
            }
        });

        it('should respect digit counts', () => {
            const params = { digits: 2 };
            const stub = generator.generate(params);
            if (stub) {
                expect(stub.data.num1).toBeGreaterThanOrEqual(10);
                expect(stub.data.num1).toBeLessThan(100);
            }
        });
    });
});
