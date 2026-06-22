"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  Image as ImageIcon,
  Code,
  Quote,
  Table,
  List,
  ListOrdered,
  Eye,
  Edit2,
  Columns,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./markdown-renderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your article using Markdown...",
  minHeight = "400px",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "split">("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    let cursorOffset = 0;

    switch (type) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case "strike":
        replacement = `~~${selectedText || "strikethrough text"}~~`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "h1":
        replacement = `\n# ${selectedText || "Heading 1"}\n`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "h2":
        replacement = `\n## ${selectedText || "Heading 2"}\n`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      case "h3":
        replacement = `\n### ${selectedText || "Heading 3"}\n`;
        cursorOffset = selectedText ? 0 : 4;
        break;
      case "link":
        replacement = `[${selectedText || "Link Text"}](https://example.com)`;
        cursorOffset = selectedText ? 21 : 12;
        break;
      case "image":
        replacement = `![${selectedText || "Image Alt Text"}](https://example.com/image.jpg)`;
        cursorOffset = selectedText ? 31 : 16;
        break;
      case "code":
        replacement = `\n\`\`\`javascript\n${selectedText || "// code goes here"}\n\`\`\`\n`;
        cursorOffset = selectedText ? 0 : 18;
        break;
      case "quote":
        replacement = `\n> ${selectedText || "Blockquote text"}\n`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "ul":
        replacement = `\n- ${selectedText || "List item"}\n`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "ol":
        replacement = `\n1. ${selectedText || "List item"}\n`;
        cursorOffset = selectedText ? 0 : 3;
        break;
      case "table":
        replacement = `\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n`;
        cursorOffset = 0;
        break;
      default:
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Set selection back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length - cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="flex flex-col border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-stone-950">
      {/* Editor Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("h1")}
            title="Heading 1"
          >
            <span className="font-bold text-xs">H1</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("h2")}
            title="Heading 2"
          >
            <span className="font-bold text-xs">H2</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("h3")}
            title="Heading 3"
          >
            <span className="font-bold text-xs">H3</span>
          </Button>
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("bold")}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("italic")}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </Button>
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("link")}
            title="Insert Link"
          >
            <Link className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("image")}
            title="Insert Image"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("code")}
            title="Code Block"
          >
            <Code className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("quote")}
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </Button>
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("ul")}
            title="Unordered List"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("ol")}
            title="Ordered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-stone-600 dark:text-stone-400 hover:text-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800"
            onClick={() => insertMarkdown("table")}
            title="Insert Table"
          >
            <Table className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded bg-stone-100/50 dark:bg-stone-900/50 p-0.5">
          <Button
            type="button"
            variant={activeTab === "write" ? "secondary" : "ghost"}
            className="h-6 px-2 text-[11px] font-semibold flex items-center gap-1 rounded bg-transparent data-[state=active]:bg-white"
            onClick={() => setActiveTab("write")}
            data-state={activeTab === "write" ? "active" : ""}
          >
            <Edit2 className="h-3 w-3" /> Write
          </Button>
          <Button
            type="button"
            variant={activeTab === "preview" ? "secondary" : "ghost"}
            className="h-6 px-2 text-[11px] font-semibold flex items-center gap-1 rounded bg-transparent data-[state=active]:bg-white"
            onClick={() => setActiveTab("preview")}
            data-state={activeTab === "preview" ? "active" : ""}
          >
            <Eye className="h-3 w-3" /> Preview
          </Button>
          <Button
            type="button"
            variant={activeTab === "split" ? "secondary" : "ghost"}
            className="h-6 px-2 text-[11px] font-semibold flex items-center gap-1 rounded bg-transparent data-[state=active]:bg-white hidden md:flex"
            onClick={() => setActiveTab("split")}
            data-state={activeTab === "split" ? "active" : ""}
          >
            <Columns className="h-3 w-3" /> Split
          </Button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div
        className={`grid divide-stone-200 dark:divide-stone-800 min-h-[300px] bg-stone-50/10 dark:bg-stone-950/10 ${
          activeTab === "split" ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" : "grid-cols-1"
        }`}
        style={{ minHeight }}
      >
        {/* Text Area Input */}
        {(activeTab === "write" || activeTab === "split") && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[300px] p-4 outline-none resize-none font-mono text-xs leading-relaxed bg-white dark:bg-stone-950 text-stone-850 dark:text-stone-150 border-0"
            style={{ minHeight }}
          />
        )}

        {/* Live Preview Pane */}
        {(activeTab === "preview" || activeTab === "split") && (
          <div
            className="w-full h-full p-4 overflow-y-auto bg-stone-50/10 dark:bg-stone-950/20 max-h-[500px]"
            style={{ minHeight }}
          >
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400 italic">
                Nothing to preview yet. Write some markdown content.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
