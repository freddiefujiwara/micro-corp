import { describe, it, expect } from 'vitest';
import { RATES } from '../src/data/rates.js';
import {
  calculateNationalPension,
  calculateKoseiNenkin,
  getPensionStandardRemuneration
} from '../src/domain/pension.js';
import {
  calculateKyokaiKenpo,
  calculateOptionalContinued,
  calculateNHI,
  getHealthStandardRemuneration
} from '../src/domain/health-insurance.js';
import { runSimulation, getOptimizationData } from '../src/domain/scenario-engine.js';

describe('Pension Calculations', () => {
  it('calculates national pension for 12 months', () => {
    expect(calculateNationalPension(12)).toBe(16980 * 12);
  });

  it('calculates Kosei Nenkin for 100,000 monthly remuneration', () => {
    const result = calculateKoseiNenkin(100000);
    // standard 98,000 * 0.183 = 17,934
    expect(result).toEqual({ total: 17934, individual: 8967, corporate: 8967 });
  });

  it('handles maximum welfare pension bracket and fallback branch', () => {
    expect(getPensionStandardRemuneration(1000000)).toBe(650000);
    expect(getPensionStandardRemuneration(Number.NaN)).toBe(650000);
  });
});

describe('Health Insurance Calculations', () => {
  it('calculates Kyokai Kenpo for 100,000 (no nursing care)', () => {
    const result = calculateKyokaiKenpo(100000, false);
    // standard 98,000 * 0.0998 = 9,780.4 -> 9,780
    expect(result).toEqual({ total: 9780, individual: 4890, corporate: 4890 });
  });

  it('calculates Kyokai Kenpo including nursing care', () => {
    const result = calculateKyokaiKenpo(100000, true);
    // standard 98,000 * (0.0998 + 0.0160) = 11,348.4 -> 11,348
    expect(result).toEqual({ total: 11348, individual: 5674, corporate: 5674 });
  });

  it('handles maximum health insurance bracket and fallback branch', () => {
    expect(getHealthStandardRemuneration(1000000)).toBe(980000);
    expect(getHealthStandardRemuneration(2000000)).toBe(1390000);
    expect(getHealthStandardRemuneration(Number.NaN)).toBe(1390000);
  });

  it('calculates optional continued insurance with cap and nursing branches', () => {
    const withoutNursing = calculateOptionalContinued(500000, false);
    const withNursing = calculateOptionalContinued(500000, true);

    expect(withoutNursing).toBe(Math.floor(300000 * RATES.KYOKAI_KENPO_TOKYO.HEALTH));
    expect(withNursing).toBe(
      Math.floor(300000 * (RATES.KYOKAI_KENPO_TOKYO.HEALTH + RATES.KYOKAI_KENPO_TOKYO.NURSING))
    );
  });

  it('calculates NHI and applies annual cap', () => {
    expect(calculateNHI(2000000, 1)).toBe(271700);
    expect(calculateNHI(100000000, 5)).toBe(RATES.NHI_ESTIMATE.MAX_ANNUAL);
  });
});

describe('Scenario Engine', () => {
  it('runs simulation and returns 3 scenarios with nursing enabled', () => {
    const params = {
      birthYear: new Date().getFullYear() - 45,
      dependents: '2',
      previousSalary: 400000,
      taxableIncome: 2000000,
      monthlyRemuneration: 100000,
      corporateFixedCost: 70000
    };

    const [scenario1, scenario2, scenario3] = runSimulation(params);

    expect([scenario1, scenario2, scenario3]).toHaveLength(3);
    expect(scenario1.totalCost).toBe(scenario1.healthInsurance + scenario1.pension);
    expect(scenario2.totalCost).toBe(scenario2.healthInsurance + scenario2.pension);
    expect(scenario3.totalCost).toBe(
      scenario3.healthInsurance +
        scenario3.pension +
        scenario3.corporateHealthInsurance +
        scenario3.corporatePension +
        scenario3.corporateFixedCost
    );
  });

  it('runs simulation with nursing disabled and invalid dependents', () => {
    const params = {
      birthYear: new Date().getFullYear() - 30,
      dependents: 'abc',
      previousSalary: 250000,
      taxableIncome: 1500000,
      monthlyRemuneration: 90000,
      corporateFixedCost: 50000
    };

    const [scenario1] = runSimulation(params);
    // invalid dependents should be treated as 0, then +1 for self
    expect(scenario1.healthInsurance).toBe(calculateNHI(1500000, 1));
  });

  it('generates optimization data including range boundaries', () => {
    const params = { birthYear: 1985, corporateFixedCost: 70000 };
    const data = getOptimizationData(params, 50000, 100000, 10000);

    expect(data).toHaveLength(6);
    expect(data[0]).toHaveProperty('salary', 50000);
    expect(data.at(-1)).toHaveProperty('salary', 100000);
    expect(data[0]).toHaveProperty('breakdown.fixed', 70000);
  });
});
