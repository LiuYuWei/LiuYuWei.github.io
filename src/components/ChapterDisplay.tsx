
'use client';

import type React from 'react';
// import ReactMarkdown from 'react-markdown'; // Replaced by MarkdownRenderer
// import remarkGfm from 'remark-gfm'; // Handled by MarkdownRenderer
// import Image from 'next/image'; // Handled by MarkdownRenderer
import type { ChapterContent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './ui/separator';
// import { cn } from '@/lib/utils'; // Handled by MarkdownRenderer
import MarkdownRenderer from '@/components/MarkdownRenderer'; // Import the new renderer

interface ChapterDisplayProps {
  chapter: ChapterContent;
}

const ChapterDisplay: React.FC<ChapterDisplayProps> = ({ chapter }) => {
  return (
    <Card className="overflow-hidden shadow-lg rounded-xl">
      <CardHeader className="bg-muted/30 p-6">
        <CardTitle className="text-3xl font-headline text-primary">
          {chapter.order}. {chapter.meta?.title || chapter.navTitle}
        </CardTitle>
        {chapter.meta?.summary && (
          <CardDescription className="text-md text-muted-foreground pt-2">
            {chapter.meta.summary}
          </CardDescription>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
          <MarkdownRenderer 
            content={chapter.content}
            imageProps={{ defaultAlt: "章節圖片", defaultHint: "chapter content" }}
          />
        </article>
      </CardContent>
    </Card>
  );
};

export default ChapterDisplay;
