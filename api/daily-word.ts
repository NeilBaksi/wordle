import { ANSWERS } from '../src/data/words';

export const config = { runtime: 'edge' };

function dateHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function handler(): Response {
  const today = new Date().toISOString().slice(0, 10);
  const word = ANSWERS[dateHash(today) % ANSWERS.length];
  return Response.json(
    { word, date: today },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
