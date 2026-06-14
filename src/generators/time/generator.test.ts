import { describe, it, expect, beforeEach } from 'vitest';
import { TimeGenerator } from './generator.ts';
import { config } from './permutations.ts';
import { setSeed } from '../../lib/random.ts';
import { Ability, Area, Scope } from 'edugraph-ts';

describe('TimeGenerator', () => {
    let generator: TimeGenerator;

    beforeEach(() => {
        generator = new TimeGenerator();
        setSeed(config.generationConfig.seed);
    });

    it('should have the correct type and compatible renderers', () => {
        expect(generator.type).toBe('time');
        expect(generator.compatibleRenderers).toContain('time-analog');
    });

    describe('generateLabels', () => {
        it('should generate labels for all permutations', () => {
            config.generationConfig.permutations.forEach(params => {
                const labels = generator.generateLabels(params);
                expect(labels).toContain(Area.MeasuringTime);
                expect(labels).toContain(Scope.AnalogClock);
                
                if (params.interval < 60) {
                    expect(labels).toContain(Scope.SecondIntervals);
                } else if (params.interval < 3600) {
                    expect(labels).toContain(Scope.MinuteIntervals);
                } else {
                    expect(labels).toContain(Scope.HourIntervals);
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
                    expect(stub.data.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
                    expect(stub.data.interval).toBe(params.interval);
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
        it('should align time with the requested interval (1 hour)', () => {
            const params = { interval: 3600 };
            for (let i = 0; i < 50; i++) {
                const stub = generator.generate(params);
                if (stub) {
                    const [h, m, s] = stub.data.time.split(':').map(Number);
                    expect(m).toBe(0);
                    expect(s).toBe(0);
                    expect(h).toBeLessThan(24);
                }
            }
        });

        it('should align time with the requested interval (15 minutes)', () => {
            const params = { interval: 900 };
            for (let i = 0; i < 50; i++) {
                const stub = generator.generate(params);
                if (stub) {
                    const [h, m, s] = stub.data.time.split(':').map(Number);
                    expect(m % 15).toBe(0);
                    expect(s).toBe(0);
                }
            }
        });

        it('should never exceed 23:59:59', () => {
            const params = { interval: 1 };
            for (let i = 0; i < 100; i++) {
                const stub = generator.generate(params);
                if (stub) {
                    const [h, m, s] = stub.data.time.split(':').map(Number);
                    expect(h).toBeLessThan(24);
                    expect(m).toBeLessThan(60);
                    expect(s).toBeLessThan(60);
                }
            }
        });
    });
});
