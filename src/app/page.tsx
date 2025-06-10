
import { getAvailableWorkshops } from '@/lib/markdown';
import type { Workshop } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookMarked } from 'lucide-react'; // Changed icon for better semantics

export default async function WorkshopSelectionPage() {
  const workshops: Workshop[] = await getAvailableWorkshops();

  return (
    <ScrollArea className="h-screen" id="main-content-scroll-area">
      <div className="w-full max-w-screen-2xl mx-auto py-12 px-4 md:px-8"> {/* Adjusted width */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold font-headline text-primary tracking-tight">
            Education Course from Simon Liu - Edumon Workshop Platform
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            請選擇一個工作坊開始學習
          </p>
        </header>

        {workshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map((workshop) => (
              <Card key={workshop.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-2xl font-headline text-primary flex items-center">
                    <BookMarked className="mr-3 h-6 w-6 text-primary/80" />
                    {workshop.title || workshop.name} {/* Use title from home.md or fallback to derived name */}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <CardDescription className="text-muted-foreground mb-6 line-clamp-3"> {/* line-clamp to limit description length */}
                    {workshop.description || `點擊進入 ${workshop.title || workshop.name} 工作坊探索更多內容。`} {/* Use description or fallback */}
                  </CardDescription>
                  <Button asChild className="w-full shadow-md mt-auto">
                    <Link href={`/workshops/${workshop.id}`}>進入工作坊</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">目前沒有可用的工作坊。</p>
            <p className="mt-2 text-sm text-muted-foreground">請確認 `src/markdown` 目錄下有工作坊資料夾 (包含 `main.md` 和 `home.md`) 或預設工作坊檔案。</p>
          </div>
        )}
        <footer className="mt-20 py-8 text-center text-muted-foreground text-sm border-t">
          <p>&copy; {new Date().getFullYear()} Simon Liu. Copyright Reserved. Made by Firebase Studio.</p>
        </footer>
      </div>
    </ScrollArea>
  );
}
