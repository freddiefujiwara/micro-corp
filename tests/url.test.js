import { describe, it, expect } from 'vitest';
import { encode, decode } from '../src/domain/url.js';

describe('URL persistence logic', () => {
  const sampleParams = {
    birthYear: 1985,
    dependents: 1,
    previousSalary: 500000,
    taxableIncome: 3000000,
    monthlyRemuneration: 150000,
    corporateFixedCost: 100000
  };

  it('encodes and decodes back to the same object', () => {
    const encoded = encode(sampleParams);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decode(encoded);
    expect(decoded).toEqual(sampleParams);
  });

  it('handles empty or null values safely', () => {
    expect(encode(null)).toBe("");
    expect(decode(null)).toBeNull();
    expect(decode("")).toBeNull();
  });

  it('handles invalid encoded strings safely', () => {
    // Some random non-lz string
    expect(decode("invalid-token-!@#$%")).toBeNull();
  });

  it('normalizes underscores back to plus signs for LZString compatibility', () => {
    // The encode function replaces + with _
    const obj = { a: 1 };
    const encoded = encode(obj);
    if (encoded.includes('_')) {
        const decoded = decode(encoded);
        expect(decoded).toEqual(obj);
    }
  });
});
