import { BookOpenTextIcon } from 'lucide-react';
import type React from 'react';

const EduFlowLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-1">
      <BookOpenTextIcon className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-headline text-primary">EduFlow</span>
    </div>
  );
};

export default EduFlowLogo;
