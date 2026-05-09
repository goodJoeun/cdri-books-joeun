import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ term: string }> },
) {
  const { term } = await params;
  db.prepare('DELETE FROM search_history WHERE term = ?').run(
    decodeURIComponent(term),
  );
  return NextResponse.json({ ok: true });
}
