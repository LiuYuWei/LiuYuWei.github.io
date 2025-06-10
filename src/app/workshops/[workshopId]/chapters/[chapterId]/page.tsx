
'use server';

import type { Metadata } from 'next';
import { getChapterContentById, getChapterNavItems, getAvailableWorkshops, getHomePageContent } from '@/lib/markdown';
import type { ChapterContent, ChapterNavItem } from '@/lib/types';
import ChapterDisplay from '@/components/ChapterDisplay';
import NextChapterButton from '@/components/NextChapterButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notFound } from 'next/navigation';

interface WorkshopChapterPageProps {
  params: { workshopId: string; chapterId: string };
}

export async function generateStaticParams() {
  const workshops = await getAvailableWorkshops();
  const params: { workshopId: string; chapterId: string }[] = [];

  for (const workshop of workshops) {
    const navItems = await getChapterNavItems(workshop.id);
    for (const item of navItems) {
      params.push({
        workshopId: workshop.id,
        chapterId: item.id,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: WorkshopChapterPageProps): Promise<Metadata> {
  const chapter = await getChapterContentById(params.chapterId, params.workshopId);
  const workshopHomeContent = await getHomePageContent(params.workshopId);
  const workshopName = workshopHomeContent?.title || params.workshopId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  if (!chapter) {
    return {
      title: `章節未找到 - ${workshopName} - Edumon`,
    };
  }
  return {
    title: `${chapter.meta?.title || chapter.navTitle} - ${workshopName} - Edumon`,
    description: `Edumon 教學平台 - ${workshopName} - ${chapter.meta?.title || chapter.navTitle}`,
  };
}

export default async function WorkshopChapterPage({ params }: WorkshopChapterPageProps) {
  const { workshopId, chapterId } = params;
  const allNavItems = await getChapterNavItems(workshopId);
  const chapter = await getChapterContentById(chapterId, workshopId);

  if (!chapter) {
    // Check if workshop or chapter is genuinely missing
    const workshops = await getAvailableWorkshops();
    if (!workshops.find(w => w.id === workshopId)) {
      notFound(); // Workshop itself is invalid
    }
    // If workshop is valid, but chapter is not, it's a chapter notFound
    notFound();
  }

  const currentIndex = allNavItems.findIndex(item => item.id === chapterId);
  const nextChapter = currentIndex !== -1 && currentIndex < allNavItems.length - 1 
    ? allNavItems[currentIndex + 1] 
    : null;

  return (
    <ScrollArea className="h-[calc(100vh-60px)]" id="main-content-scroll-area"> 
      <div className="w-full max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
        <ChapterDisplay chapter={chapter} />
        {nextChapter && (
          <div className="mt-8 flex justify-end">
            <NextChapterButton workshopId={workshopId} chapterId={nextChapter.id} />
          </div>
        )}
         <footer className="mt-16 py-8 text-center text-muted-foreground text-sm border-t">
            <p>&copy; {new Date().getFullYear()} Simon Liu. Copyright Reserved. Made by Firebase Studio</p>
        </footer>
      </div>
    </ScrollArea>
  );
}
