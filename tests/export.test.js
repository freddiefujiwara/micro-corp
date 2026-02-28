import { describe, it, expect } from 'vitest';
import { buildConditionsAndAlgorithmJson } from '../src/domain/export.js';

describe('Export Logic', () => {
  it('builds export JSON with correct structure', () => {
    const params = { birthYear: 1985 };
    const results = [{ name: 'Scenario 1', totalCost: 100, healthInsurance: 50, pension: 50, corporateHealthInsurance: 0, corporatePension: 0, corporateFixedCost: 0 }];
    const rates = { SOME_RATE: 0.1 };
    const table = [{ level: 1 }];

    const exportData = buildConditionsAndAlgorithmJson(params, results, rates, table);

    expect(exportData.simulationInputs.birthYear).toBe(1985);
    expect(exportData.simulationInputs.timestamp).toBeDefined();
    expect(exportData.simulationResults).toHaveLength(1);
    expect(exportData.simulationResults[0].name).toBe('Scenario 1');
    expect(exportData.logicDetails.rates.SOME_RATE).toBe(0.1);
    expect(exportData.logicDetails.remunerationTable).toHaveLength(1);
  });
});
