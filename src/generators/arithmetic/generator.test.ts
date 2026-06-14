import { describe, it, expect, beforeEach } from 'vitest';
import { ArithmeticGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability } from 'edugraph-ts';

describe('ArithmeticGenerator', () => {
    let generator: ArithmeticGenerator;

    beforeEach(() => {
        generator = new ArithmeticGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('arithmetic');
        expect(generator.compatibleRenderers).toContain('operations-boxes');
        expect(generator.compatibleRenderers).toContain('operations-vertical');
    });

    describe('generateLabels', () => {
        it('should generate labels for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const labels = generator.generateLabels(params);
                expect(labels).toBeInstanceOf(Array);
                expect(labels.length).toBeGreaterThan(0);
                // Basic check for mandatory tags
                expect(labels).toContain(Ability.ProcedureApplication);
            });
        });
    });

    describe('generate', () => {
        it('should generate valid problem stubs for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.id).toBeDefined();
                    expect(stub.data).toBeDefined();
                    expect(stub.data.num1).toBeDefined();
                    expect(stub.data.num2).toBeDefined();
                    expect(stub.data.answer).toBeDefined();
                    expect(stub.data.operator).toBeDefined();
                    
                    // Verify operator is one of the requested ones
                    const requestedOps = params.operations ? params.operations.split(',') : ['add'];
                    expect(requestedOps).toContain(stub.data.operator);
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
        it('should never produce negative answers for subtraction if allowNegatives is false', () => {
            const params = { operations: 'subtract', allowNegatives: false, digitsNum1: 1, digitsNum2: 1 };
            for (let i = 0; i < 100; i++) {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.data.answer).toBeGreaterThanOrEqual(0);
                }
            }
        });

        it('should always produce integer results for division', () => {
            const params = { operations: 'divide', digitsNum1: 2, digitsNum2: 1 };
            for (let i = 0; i < 50; i++) {
                const stub = generator.generate(params);
                if (stub) {
                    expect(Number.isInteger(stub.data.answer)).toBe(true);
                }
            }
        });

        it('should respect digit constraints for large numbers', () => {
            const params = { operations: 'add', digitsNum1: 3, digitsNum2: 3 };
            const stub = generator.generate(params);
            if (stub) {
                expect(stub.data.num1).toBeGreaterThanOrEqual(100);
                expect(stub.data.num1).toBeLessThan(1000);
                expect(stub.data.num2).toBeGreaterThanOrEqual(100);
                expect(stub.data.num2).toBeLessThan(1000);
            }
        });
    });
});
