
import type { Metadata } from 'next';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import EdumonLogo from '@/components/EdumonLogo';
import ChapterNavigation from '@/components/ChapterNavigation';
import { getChapterNavItems, getHomePageContent, getAvailableWorkshops } from '@/lib/markdown';
import type { ChapterNavItem, HomePageContent, Workshop } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import WorkshopSwitcherDropdown from '@/components/WorkshopSwitcherDropdown';


interface WorkshopLayoutProps {
  children: React.ReactNode;
  params: { workshopId: string };
}

export async function generateStaticParams() {
  const workshops = await getAvailableWorkshops();
  return workshops.map(workshop => ({ workshopId: workshop.id }));
}

export async function generateMetadata({ params }: WorkshopLayoutProps): Promise<Metadata> {
  const homeContent: HomePageContent | null = await getHomePageContent(params.workshopId);
  const workshopName = homeContent?.title || params.workshopId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${workshopName} - Edumon`,
    description: `Edumon 教學平台 - ${homeContent?.description || workshopName}`,
  };
}

export default async function WorkshopLayout({
  children,
  params,
}: WorkshopLayoutProps) {
  const { workshopId } = params;
  const chapterNavItems: ChapterNavItem[] = await getChapterNavItems(workshopId);
  const homeContent: HomePageContent | null = await getHomePageContent(workshopId);
  const allWorkshops: Workshop[] = await getAvailableWorkshops();
  
  const workshopDisplayName = homeContent?.title || workshopId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar 
        side="left" 
        collapsible="icon" 
        className="border-r shadow-lg"
        variant="sidebar"
      >
        <SidebarHeader className="h-[60px] px-4 border-b flex items-center justify-between">
          <EdumonLogo />
        </SidebarHeader>
        <SidebarContent>
          <ChapterNavigation chapters={chapterNavItems} workshopId={workshopId} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="h-[60px] px-4 flex items-center justify-between bg-card text-card-foreground shadow-sm border-b sticky top-0 z-10">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2 md:hidden" /> {/* Mobile trigger */}
            <SidebarTrigger className="mr-4 hidden md:flex" /> {/* Desktop trigger */}
            <Button variant="ghost" size="sm" asChild className="mr-2 text-sm">
                <Link href="/">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    所有工作坊
                </Link>
            </Button>
            <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">|</span>
            <h2 className="text-lg font-semibold text-primary truncate" title={workshopDisplayName}>
              {workshopDisplayName}
            </h2>
          </div>
          <WorkshopSwitcherDropdown currentWorkshopId={workshopId} workshops={allWorkshops} />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
