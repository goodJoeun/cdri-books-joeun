import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const MAX_HISTORY = 8;

export async function GET() {
  const rows = db
    .prepare('SELECT term FROM search_history ORDER BY added_at DESC LIMIT ?')
    .all(MAX_HISTORY) as { term: string }[];
  return NextResponse.json(rows.map((r) => r.term));
}

export async function POST(request: NextRequest) {
  const { term } = (await request.json()) as { term: string };
  db.prepare(
    `INSERT INTO search_history (term, added_at)
     VALUES (?, unixepoch())
     ON CONFLICT(term) DO UPDATE SET added_at = unixepoch()`,
  ).run(term);
  db.prepare(
    `DELETE FROM search_history
     WHERE term NOT IN (
       SELECT term FROM search_history ORDER BY added_at DESC LIMIT ?
     )`,
  ).run(MAX_HISTORY);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  db.prepare('DELETE FROM search_history').run();
  return NextResponse.json({ ok: true });
}
