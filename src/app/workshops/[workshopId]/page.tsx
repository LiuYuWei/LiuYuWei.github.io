
import { getHomePageContent, getChapterNavItems, getAvailableWorkshops } from '@/lib/markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HomePageContent, ChapterNavItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { notFound } from 'next/navigation';

interface WorkshopHomePageProps {
  params: { workshopId: string };
}

export async function generateStaticParams() {
  const workshops = await getAvailableWorkshops();
  return workshops.map(workshop => ({ workshopId: workshop.id }));
}

export default async function WorkshopHomePage({ params }: WorkshopHomePageProps) {
  const { workshopId } = params;
  const homeContent: HomePageContent | null = await getHomePageContent(workshopId);
  const chapters: ChapterNavItem[] = await getChapterNavItems(workshopId);
  const firstChapterId = chapters.length > 0 ? chapters[0].id : null;

  if (!homeContent) {
    // Check if the workshop itself is valid before calling notFound for content
    const workshops = await getAvailableWorkshops();
    if (!workshops.find(w => w.id === workshopId)) {
        notFound(); // Workshop ID is invalid
    }
    // If workshop ID is valid but content is missing, show a specific message
    return (
      <ScrollArea className="h-[calc(100vh-60px)]" id="main-content-scroll-area">
        <div className="w-full max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold font-headline text-primary tracking-tight sm:text-5xl">
              {workshopId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
          </header>
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">無法載入此工作坊的首頁內容。</p>
            <p className="mt-2 text-sm text-muted-foreground">請確認 `src/markdown/${workshopId}/home.md` 檔案是否存在且格式正確。</p>
          </div>
          <footer className="mt-16 py-8 text-center text-muted-foreground text-sm border-t">
            <p>&copy; {new Date().getFullYear()} Simon Liu. Copyright Reserved. Made by Firebase Studio</p>
          </footer>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-60px)]" id="main-content-scroll-area">
      <div className="w-full max-w-screen-2xl mx-auto py-8 px-4 md:px-8">
        <Card className="overflow-hidden shadow-lg rounded-xl">
          <CardHeader className="bg-muted/30 p-6">
            <CardTitle className="text-3xl font-headline text-primary">
              {homeContent.title}
            </CardTitle>
            {homeContent.description && (
              <CardDescription className="text-md text-muted-foreground pt-2">
                {homeContent.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
              <MarkdownRenderer 
                content={homeContent.content}
                imageProps={{ defaultAlt: "首頁圖片", defaultHint: "homepage content" }}
              />
            </article>
            {firstChapterId && (
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" className="shadow-md">
                  <Link href={`/workshops/${workshopId}/chapters/${firstChapterId}`}>開始學習</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <footer className="mt-16 py-8 text-center text-muted-foreground text-sm border-t">
          <p>&copy; {new Date().getFullYear()} Simon Liu. Copyright Reserved. Made by Firebase Studio</p>
        </footer>
      </div>
    </ScrollArea>
  );
}
