
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ChapterNavItem, ChapterContent, ChapterMeta, HomePageContent, Workshop } from './types';

const baseMarkdownDir = path.join(process.cwd(), 'src', 'markdown');
const DEFAULT_WORKSHOP_ID = '_default'; // Represents content directly in src/markdown

function getWorkshopDir(workshopId?: string | null): string {
  if (!workshopId || workshopId === DEFAULT_WORKSHOP_ID) {
    return baseMarkdownDir;
  }
  return path.join(baseMarkdownDir, workshopId);
}

async function getWorkshopHomeDetails(workshopBasePath: string, workshopId: string): Promise<{title?: string, description?: string}> {
  const homeMdPath = path.join(workshopBasePath, 'home.md');
  try {
    const fileContent = await fs.promises.readFile(homeMdPath, 'utf-8');
    const { data } = matter(fileContent);
    return {
      title: data.title as string | undefined,
      description: data.description as string | undefined,
    };
  } catch (error) {
    // home.md might not exist or frontmatter might be missing, which is acceptable.
    // console.warn(`Could not read or parse frontmatter for home.md in workshop ${workshopId}:`, error);
    return {};
  }
}

export async function getAvailableWorkshops(): Promise<Workshop[]> {
  const workshops: Workshop[] = [];
  try {
    // Check for the default workshop first
    const defaultMainMdExists = fs.existsSync(path.join(baseMarkdownDir, 'main.md'));
    const defaultHomeMdExists = fs.existsSync(path.join(baseMarkdownDir, 'home.md'));
    if (defaultMainMdExists || defaultHomeMdExists) {
      const homeDetails = await getWorkshopHomeDetails(baseMarkdownDir, DEFAULT_WORKSHOP_ID);
      workshops.push({
        id: DEFAULT_WORKSHOP_ID,
        name: 'Default Workshop', // Fallback name
        basePath: baseMarkdownDir,
        title: homeDetails.title,
        description: homeDetails.description,
      });
    }

    const entries = await fs.promises.readdir(baseMarkdownDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const workshopId = entry.name;
        const workshopPath = path.join(baseMarkdownDir, workshopId);
        const mainMdExists = fs.existsSync(path.join(workshopPath, 'main.md'));
        const homeMdExists = fs.existsSync(path.join(workshopPath, 'home.md'));

        if (mainMdExists || homeMdExists) { // Only add if it's a valid workshop dir
          const homeDetails = await getWorkshopHomeDetails(workshopPath, workshopId);
          const derivedName = workshopId
            .replace(/([A-Z])/g, ' $1')
            .replace(/[_-]/g, ' ')
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
            .trim();
          
          workshops.push({ 
            id: workshopId, 
            name: derivedName || workshopId, // Fallback name
            basePath: workshopPath,
            title: homeDetails.title,
            description: homeDetails.description,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error discovering workshops:", error);
  }
  return workshops;
}


export async function getChapterNavItems(workshopId?: string): Promise<ChapterNavItem[]> {
  const currentWorkshopDir = getWorkshopDir(workshopId);
  const mainMdPath = path.join(currentWorkshopDir, 'main.md');
  try {
    const mainMdContent = await fs.promises.readFile(mainMdPath, 'utf-8');
    const lines = mainMdContent.split('\n').filter(line => line.trim().startsWith('- ['));
    
    return lines.map((line, index) => {
      const match = line.match(/- \[(.+?)\]\((.+?)\)/);
      if (match) {
        const navTitle = match[1];
        const relativeFilePath = match[2].replace(/^\.\//, ''); 
        const id = path.basename(relativeFilePath, '.md');
        return {
          id,
          navTitle,
          filePath: path.join(currentWorkshopDir, relativeFilePath), // Path relative to specific workshop
          order: index + 1,
        };
      }
      return null;
    }).filter(item => item !== null) as ChapterNavItem[];
  } catch (error) {
    console.error(`Error reading or parsing main.md for workshop "${workshopId || DEFAULT_WORKSHOP_ID}" at ${mainMdPath}:`, error);
    return [];
  }
}

export async function getChapterContentById(chapterId: string, workshopId?: string): Promise<ChapterContent | null> {
  const navItems = await getChapterNavItems(workshopId); // Fetch nav items for the specific workshop
  const navItem = navItems.find(item => item.id === chapterId);
  if (!navItem) {
    console.warn(`Warning: Chapter with ID "${chapterId}" not found in workshop "${workshopId || DEFAULT_WORKSHOP_ID}".`);
    return null;
  }

  try {
    const fileContent = await fs.promises.readFile(navItem.filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    return {
      ...navItem,
      meta: data as ChapterMeta,
      content,
    };
  } catch (error) {
    console.error(`Error reading chapter file ${navItem.filePath} for workshop "${workshopId || DEFAULT_WORKSHOP_ID}":`, error);
    return null;
  }
}

export async function getAllChaptersContent(workshopId?: string): Promise<ChapterContent[]> {
  const navItems = await getChapterNavItems(workshopId);
  const chaptersContent = await Promise.all(
    navItems.map(navItem => getChapterContentById(navItem.id, workshopId))
  );
  return chaptersContent.filter(c => c !== null) as ChapterContent[];
}

export async function getHomePageContent(workshopId?: string): Promise<HomePageContent | null> {
  const currentWorkshopDir = getWorkshopDir(workshopId);
  const homeMdPath = path.join(currentWorkshopDir, 'home.md');
  try {
    const fileContent = await fs.promises.readFile(homeMdPath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // Determine the workshop display name
    let workshopDisplayName: string;
    if (workshopId && workshopId !== DEFAULT_WORKSHOP_ID) {
      workshopDisplayName = workshopId
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/[_-]/g, ' ')    // Replace underscores/hyphens with spaces
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) // Capitalize first letter of each word
        .trim();
    } else {
      // For default workshop, try to get title from its own home.md, or use a generic default
      const defaultWorkshopHomeDetails = await getWorkshopHomeDetails(baseMarkdownDir, DEFAULT_WORKSHOP_ID);
      workshopDisplayName = defaultWorkshopHomeDetails.title || 'Default Workshop';
    }

    return {
      title: data.title as string || workshopDisplayName, // Use title from home.md or derived/default name
      description: data.description as string || `探索 ${workshopDisplayName} 的內容。`, // Use description or a generic one
      content: content,
    };
  } catch (error) {
    // console.error(`Error reading home.md for workshop "${workshopId || DEFAULT_WORKSHOP_ID}" at ${homeMdPath}:`, error);
    // If home.md is specifically requested (e.g. for a workshop's own homepage) and fails,
    // it might be better to return null to indicate an issue,
    // rather than trying to fabricate content here.
    // The calling function can then decide how to handle a null (e.g., show a "not found" message).
    return null;
  }
}
