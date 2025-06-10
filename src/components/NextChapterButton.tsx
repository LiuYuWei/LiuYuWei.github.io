
'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type React from 'react';
import { useRouter } from 'next/navigation';

interface NextChapterButtonProps {
  workshopId: string;
  chapterId: string; // This will be the ID of the *next* chapter
}

const NextChapterButton: React.FC<NextChapterButtonProps> = ({ workshopId, chapterId }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/workshops/${workshopId}/chapters/${chapterId}`);
  };

  return (
    <Button onClick={handleClick} className="shadow-md">
      下一步
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default NextChapterButton;
