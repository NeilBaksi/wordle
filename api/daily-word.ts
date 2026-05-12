import { ANSWERS, ANSWERS_ES } from '../src/data/words';

export const config = { runtime: 'edge' };

function dateHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function handler(req: Request): Response {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') === 'es' ? 'es' : 'en';
  const answers = lang === 'es' ? ANSWERS_ES : ANSWERS;
  const today = new Date().toISOString().slice(0, 10);
  const word = answers[dateHash(today) % answers.length];
  return Response.json(
    { word, date: today, lang },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
