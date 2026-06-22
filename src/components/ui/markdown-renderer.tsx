"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body font-[var(--font-zenvoraa)] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-2xl sm:text-3xl font-serif font-medium mt-8 mb-4 text-[#222222] tracking-wide" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-xl sm:text-2xl font-serif font-medium mt-6 mb-3 text-[#222222] tracking-wide" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-lg sm:text-xl font-serif font-semibold mt-6 mb-2 text-[#222222]" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="text-base font-semibold mt-4 mb-2 text-[#222222]" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="text-sm text-[#555555] leading-7 mb-4" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc pl-5 mb-5 space-y-1.5 text-sm text-[#555555]" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-5 mb-5 space-y-1.5 text-sm text-[#555555]" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="text-sm leading-6 text-[#555555]" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-2 border-[#c29958] pl-4 italic text-[#777777] my-6 font-serif bg-stone-50/50 py-1" {...props} />
          ),
          pre: ({ ...props }) => (
            <pre className="bg-[#f7f2ea] dark:bg-stone-900 p-4 rounded-lg overflow-x-auto text-xs font-mono my-6 text-stone-850 dark:text-stone-150 border border-stone-200/40 dark:border-stone-800" {...props} />
          ),
          code: ({ ...props }) => (
            <code className="bg-[#f7f2ea] dark:bg-stone-900 px-1.5 py-0.5 rounded text-xs font-mono text-[#c29958] font-semibold" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-[#c29958] underline hover:text-[#222222] transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-left text-sm border border-stone-200 dark:border-stone-800" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="border-b border-stone-200 dark:border-stone-800 bg-[#f7f2ea] dark:bg-stone-900/50 px-4 py-2.5 font-semibold text-stone-900 dark:text-stone-100" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="border-b border-stone-100 dark:border-stone-900 px-4 py-2 text-[#555555] dark:text-stone-300" {...props} />
          ),
          hr: ({ ...props }) => (
            <hr className="my-8 border-t border-[#eee8df] dark:border-stone-800" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
