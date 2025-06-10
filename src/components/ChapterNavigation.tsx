
'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } // useParams will give { workshopId, chapterId }
from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { ChapterNavItem } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface ChapterNavigationProps {
  chapters: ChapterNavItem[];
  workshopId: string; 
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({ chapters, workshopId }) => {
  const router = useRouter();
  const params = useParams() as { workshopId?: string, chapterId?: string }; // Type assertion for clarity

  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;

    // Ensure params.chapterId is treated as string or undefined
    const chapterIdFromParams = Array.isArray(params.chapterId) ? params.chapterId[0] : params.chapterId;

    if (chapterIdFromParams && chapters.some(c => c.id === chapterIdFromParams)) {
      setActiveChapterId(chapterIdFromParams);
      // Consider namespacing localStorage key by workshopId if needed in future
      // localStorage.setItem(`edumon-last-chapter-page-${workshopId}`, chapterIdFromParams);
    } else {
      setActiveChapterId(null);
    }
  }, [params.chapterId, chapters, workshopId, isClient]);


  const handleNavigateToChapter = (chapterFileId: string) => {
    router.push(`/workshops/${workshopId}/chapters/${chapterFileId}`);
  };

  if (!chapters || chapters.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">此工作坊沒有可用的章節。</p>;
  }

  return (
    <ScrollArea className="h-full">
      <SidebarMenu className="p-2">
        {chapters.map(chapter => {
          const baseNumberCircleClasses = "flex items-center justify-center w-5 h-5 text-xs rounded-full shrink-0 font-semibold group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:leading-none";
          
          let isActive = false;
          let isPassed = false;
          
          let numberCircleFinalClass = `${baseNumberCircleClasses} bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
          let titleBaseClass = "truncate"; 

          if (isClient) { 
            isActive = activeChapterId === chapter.id;
            const currentActiveOrder = activeChapterId 
              ? chapters.find(c => c.id === activeChapterId)?.order ?? Number.MAX_SAFE_INTEGER
              : Number.MAX_SAFE_INTEGER; 
            
            isPassed = activeChapterId !== null && !isActive && chapter.order < currentActiveOrder;

            if (isActive) {
              numberCircleFinalClass = `${baseNumberCircleClasses} bg-primary-foreground text-primary`;
            } else if (isPassed) {
              numberCircleFinalClass = `${baseNumberCircleClasses} bg-primary text-primary-foreground`;
              titleBaseClass = "truncate text-primary";
            } else {
              numberCircleFinalClass = `${baseNumberCircleClasses} bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300`;
            }
          }
          
          const titleFinalClass = `${titleBaseClass} group-data-[collapsible=icon]:hidden`;
          
          return (
            <SidebarMenuItem key={chapter.id}>
              <SidebarMenuButton
                onClick={() => handleNavigateToChapter(chapter.id)}
                isActive={isClient ? isActive : false} 
                className="w-full justify-start text-sm"
                variant={isClient && isActive ? "default" : "ghost"} 
                tooltip={{ children: chapter.navTitle, side: 'right', align: 'start', className: 'ml-2' }}
              >
                {isClient && isActive && <ChevronRight className="h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden" />}
                <span className={numberCircleFinalClass}>
                  {chapter.order}
                </span>
                <span className={titleFinalClass}>
                  {chapter.navTitle}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </ScrollArea>
  );
};

export default ChapterNavigation;
