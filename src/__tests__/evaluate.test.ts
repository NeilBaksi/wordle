import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../utils/evaluate';

describe('evaluateGuess', () => {
  it('marks all correct on exact match', () => {
    expect(evaluateGuess('crane', 'crane')).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  it('marks all absent when no letters match', () => {
    expect(evaluateGuess('fghij', 'abcde')).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
  });

  it('marks present when letter exists but wrong position', () => {
    const result = evaluateGuess('crane', 'nacre');
    expect(result[0]).toBe('present'); // c is in nacre but wrong pos
  });

  it('handles duplicate letters in guess — does not over-mark', () => {
    // target: 'abbey' — has one 'b'
    // guess: 'bobby' — has two 'b's
    const result = evaluateGuess('bobby', 'abbey');
    // b at pos 1: correct (abbey[1] = 'b')
    // b at pos 2: absent (only one b in target, already consumed)
    const bResults = [result[1], result[2]];
    expect(bResults).toContain('correct');
    expect(bResults).toContain('absent');
  });

  it('handles duplicate letters in target correctly', () => {
    // target: 'speed' — s[0] p[1] e[2] e[3] d[4]
    // guess:  'geese' — g[0] e[1] e[2] s[3] e[4]
    // Pass 1 exact: e[2] matches e[2] → correct. consume both.
    // Pass 2: e[1] → target has e[3] → present. s[3] → target has s[0] → present. e[4] vs d[4] no match, no remaining 'e' → absent.
    const result = evaluateGuess('geese', 'speed');
    expect(result[2]).toBe('correct'); // e at pos 2 is the exact match
  });

  it('is case-insensitive', () => {
    expect(evaluateGuess('CRANE', 'crane')).toEqual(evaluateGuess('crane', 'crane'));
  });

  it('marks present before absent when letter appears in target', () => {
    // target: 'world', guess: 'llama'
    // 'l' at pos 0: present (l is in world)
    // 'l' at pos 1: absent (only one l in world, consumed)
    // world = ['w','o','r','l','d'], llama = ['l','l','a','m','a']
    // Pass 1: no exact matches.
    // Pass 2: l[0] → target has 'l' at pos 3 → present, consume. l[1] → no more 'l' → absent.
    const result = evaluateGuess('llama', 'world');
    expect(result[0]).toBe('present');
    expect(result[1]).toBe('absent');
  });
});
