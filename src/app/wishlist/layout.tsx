import type { Metadata } from 'next';
import { strings } from '@/constants/strings';

export const metadata: Metadata = {
  title: strings.wishlist.pageTitle,
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
