
export interface ChapterMeta {
  title?: string;
  summary?: string; 
}

export interface ChapterNavItem {
  id: string;
  navTitle: string;
  filePath: string;
  order: number;
}

export interface ChapterContent extends ChapterNavItem {
  meta: ChapterMeta;
  content: string; // Markdown content string
}

export interface HomePageContent {
  title: string;
  description: string;
  content: string; // Markdown content for the body
}

export interface Workshop {
  id: string;
  name: string; // Derived from folder name, fallback if home.md title is missing
  basePath: string;
  title?: string; // From home.md frontmatter
  description?: string; // From home.md frontmatter
}
