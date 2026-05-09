import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn } = await params;
  db.prepare('DELETE FROM wishlist WHERE isbn = ?').run(isbn);
  return NextResponse.json({ ok: true });
}
