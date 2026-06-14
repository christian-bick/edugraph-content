import { describe, it, expect, beforeEach } from 'vitest';
import { WritingGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability, Area, Scope } from 'edugraph-ts';

describe('WritingGenerator', () => {
    let generator: WritingGenerator;

    beforeEach(() => {
        generator = new WritingGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('writing');
        expect(generator.compatibleRenderers).toContain('numbers-write');
    });

    describe('generateLabels', () => {
        it('should generate labels', () => {
            const labels = generator.generateLabels({});
            expect(labels).toContain(Area.IntegerNotation);
            expect(labels).toContain(Ability.ProcedureExecution);
        });
    });

    describe('generate', () => {
        it('should generate valid problem stubs for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const stub = generator.generate(params);
                if (stub) {
                    expect(stub.id).toBeDefined();
                    expect(stub.data.number).toBe(params.number);
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
