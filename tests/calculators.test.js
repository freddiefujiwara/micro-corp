import { describe, it, expect } from 'vitest';
import { calculateNationalPension, calculateKoseiNenkin, getPensionStandardRemuneration } from '../src/domain/pension.js';
import { calculateKyokaiKenpo, calculateOptionalContinued, calculateNHI, getHealthStandardRemuneration } from '../src/domain/health-insurance.js';
import { runSimulation, getOptimizationData } from '../src/domain/scenario-engine.js';

describe('Pension Calculations', () => {
  it('calculates national pension for 12 months', () => {
    expect(calculateNationalPension(12)).toBe(16980 * 12);
  });

  it('calculates Kosei Nenkin for 100,000 monthly remuneration', () => {
    const result = calculateKoseiNenkin(100000);
    // standard 98,000 * 0.183 = 17,934
    expect(result.total).toBe(17934);
    expect(result.individual).toBe(8967);
  });

  it('handles maximum welfare pension bracket', () => {
    expect(getPensionStandardRemuneration(1000000)).toBe(650000);
  });
});

describe('Health Insurance Calculations', () => {
  it('calculates Kyokai Kenpo for 100,000 (no nursing care)', () => {
    const result = calculateKyokaiKenpo(100000, false);
    // standard 98,000 * 0.0998 = 9,780.4 -> 9,780
    expect(result.total).toBe(9780);
  });

  it('handles maximum health insurance bracket', () => {
    // Now the table includes higher brackets up to 1.39M
    expect(getHealthStandardRemuneration(1000000)).toBe(980000);
    expect(getHealthStandardRemuneration(2000000)).toBe(1390000);
  });

  it('calculates NHI roughly', () => {
    expect(calculateNHI(2000000, 1)).toBe(271700);
  });
});

describe('Scenario Engine', () => {
  it('runs simulation and returns 3 scenarios', () => {
    const params = {
      birthYear: 1980,
      dependents: 0,
      previousSalary: 400000,
      taxableIncome: 2000000,
      monthlyRemuneration: 100000,
      corporateFixedCost: 70000
    };
    const results = runSimulation(params);
    expect(results).toHaveLength(3);
  });

  it('generates optimization data', () => {
    const params = { birthYear: 1985, corporateFixedCost: 70000 };
    const data = getOptimizationData(params, 50000, 100000, 10000);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('salary');
    expect(data[0]).toHaveProperty('totalCost');
  });
});
