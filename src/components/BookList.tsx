import { Book } from '@/types/book';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
}

export default function BookList({ books }: BookListProps) {
  if (books.length === 0) return null;
  return (
    <ul className="flex flex-col">
      {books.map((book) => (
        <BookCard key={book.isbn} book={book} />
      ))}
    </ul>
  );
}
