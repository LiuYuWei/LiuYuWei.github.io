
'use client';

import ReactMarkdown_ from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useEffect, useState } from 'react';

// Language imports for syntax highlighting
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

// Theme imports for syntax highlighting
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';

// Register languages
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);

interface MarkdownRendererProps {
  content: string;
  imageProps?: {
    defaultAlt: string;
    defaultHint: string;
  };
}

export default function MarkdownRenderer({ content, imageProps }: MarkdownRendererProps) {
  const [isClient, setIsClient] = useState(false);
  // Default to oneLight for SSR and initial client render to avoid mismatch
  const [currentThemeStyle, setCurrentThemeStyle] = useState(oneLight); 

  useEffect(() => {
    setIsClient(true);

    const determineTheme = () => {
      const prefersDarkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const hasDarkClass = document.documentElement.classList.contains('dark');
      return (hasDarkClass || prefersDarkScheme) ? oneDark : oneLight;
    };

    setCurrentThemeStyle(determineTheme());

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setCurrentThemeStyle(determineTheme());
    
    mediaQuery.addEventListener('change', handleChange);

    const observer = new MutationObserver(handleChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  const components = {
    img: ({ node, ...props }: any) => {
      let alt = props.alt || imageProps?.defaultAlt || '圖片';
      
      const hintMatch = alt.match(/\[hint:\s*([^\]]+)\]/);
      let parsedAiHintFromAlt = null;
      if (hintMatch && hintMatch[1]) {
        parsedAiHintFromAlt = hintMatch[1];
        alt = alt.replace(/\[hint:\s*([^\]]+)\]/g, '').trim();
      }
      
      const finalAiHint = node?.properties?.['data-ai-hint'] || parsedAiHintFromAlt || imageProps?.defaultHint || 'image';
      
      const imageWrapperClassName = "block my-6 text-center";
      const imageClassName = cn(
        "overflow-hidden rounded-lg shadow-md", 
        "h-auto",
        "inline-block", 
        props.className
      );

      let imageSrc = props.src;
      if (imageSrc && typeof imageSrc === 'string' && imageSrc.startsWith('./')) {
        imageSrc = imageSrc.substring(1); 
      }
      if (!imageSrc) {
        imageSrc = "https://placehold.co/600x400.png";
      }

      return (
        <span className={imageWrapperClassName}> 
          <Image
            src={imageSrc}
            alt={alt}
            width={800} 
            height={450} 
            className={imageClassName}
            data-ai-hint={finalAiHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px" 
          />
        </span>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        const styleToUse = isClient ? currentThemeStyle : oneLight;
        return (
          <div className="not-prose my-4 rounded-md overflow-hidden shadow-sm">
            <SyntaxHighlighter
              style={styleToUse}
              language={match[1]}
              showLineNumbers={false} 
              wrapLines={false}      
              customStyle={{ 
                margin: 0, 
                borderRadius: '0px',
                backgroundColor: '#000000',
              }} 
              codeTagProps={{ 
                style: { 
                  fontFamily: 'inherit',
                  color: 'inherit',
                } 
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      return (
        <code className={cn(className, "before:content-none after:content-none")} {...props}>
          {children}
        </code>
      );
    },
    a: ({ node, ...props }: any) => {
      return <a {...props} target="_blank" rel="noopener noreferrer" />;
    },
  };

  return (
    <ReactMarkdown_ remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown_>
  );
}
