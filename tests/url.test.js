import { describe, it, expect, vi, afterEach } from 'vitest';
import LZString from 'lz-string';
import { encode, decode } from '../src/domain/url.js';

afterEach(() => {
  vi.restoreAllMocks();
});

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
    expect(encode(null)).toBe('');
    expect(decode(null)).toBeNull();
    expect(decode('')).toBeNull();
  });

  it('handles invalid encoded strings safely', () => {
    expect(decode('invalid-token-!@#$%')).toBeNull();
  });

  it('normalizes spaces and underscores back to plus signs', () => {
    const obj = { a: 1 };
    const encoded = encode(obj);

    const decodedFromUnderscore = decode(encoded.replace(/\+/g, '_'));
    const decodedFromSpace = decode(encoded.replace(/_/g, ' '));

    expect(decodedFromUnderscore).toEqual(obj);
    expect(decodedFromSpace).toEqual(obj);
  });

  it('normalizes %20 back to plus signs', () => {
    const obj = { a: 1, b: 'text' };
    const encoded = LZString.compressToEncodedURIComponent(JSON.stringify(obj));
    const converted = encoded.replace(/\+/g, '%20');
    expect(decode(converted)).toEqual(obj);
  });

  it('returns null and logs error when JSON parsing fails', () => {
    const invalidJsonPayload = LZString.compressToEncodedURIComponent('{invalid-json}');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(decode(invalidJsonPayload)).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});
