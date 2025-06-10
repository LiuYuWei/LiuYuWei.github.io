
import { BookOpenTextIcon } from 'lucide-react';
import type React from 'react';
import Link from 'next/link';

const EdumonLogo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 p-1 group">
      <BookOpenTextIcon className="h-8 w-8 text-primary group-hover:text-primary/90 transition-colors" />
      <span className="text-2xl font-bold font-headline text-primary group-hover:text-primary/90 transition-colors group-data-[collapsible=icon]:hidden">Edumon</span>
    </Link>
  );
};

export default EdumonLogo;
