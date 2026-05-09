import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Book } from '@/types/book';

export async function GET() {
  const rows = db
    .prepare('SELECT data FROM wishlist ORDER BY added_at DESC')
    .all() as { data: string }[];
  return NextResponse.json(rows.map((r) => JSON.parse(r.data) as Book));
}

export async function POST(request: NextRequest) {
  const book = (await request.json()) as Book;
  const existing = db
    .prepare('SELECT isbn FROM wishlist WHERE isbn = ?')
    .get(book.isbn);
  if (existing) {
    db.prepare('DELETE FROM wishlist WHERE isbn = ?').run(book.isbn);
  } else {
    db.prepare('INSERT INTO wishlist (isbn, data) VALUES (?, ?)').run(
      book.isbn,
      JSON.stringify(book),
    );
  }
  return NextResponse.json({ ok: true });
}
