import { Client } from "@notionhq/client";

export type NotionLike = Pick<Client, "pages" | "blocks" | "search">;

export type AppendResult = {
  pageId: string;
  url: string | null;
  appendedBlocks: number;
};

export type PageUpdateResult = {
  pageId: string;
  url: string | null;
  updatedProperties: string[];
};

type TextBlockType = "paragraph" | "heading_1" | "heading_2" | "heading_3" | "bulleted_list_item" | "numbered_list_item";

function richText(content: string) {
  return [{ type: "text" as const, text: { content: content.slice(0, 2000) } }];
}

function textBlock(type: TextBlockType, content: string) {
  return {
    object: "block" as const,
    type,
    [type]: {
      rich_text: richText(content)
    }
  };
}

export function markdownToBlocks(markdown: string) {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  return lines.map((line) => {
    if (line.startsWith("### ")) return textBlock("heading_3", line.slice(4));
    if (line.startsWith("## ")) return textBlock("heading_2", line.slice(3));
    if (line.startsWith("# ")) return textBlock("heading_1", line.slice(2));
    if (line.startsWith("- ")) return textBlock("bulleted_list_item", line.slice(2));
    if (/^\d+\.\s/.test(line)) return textBlock("numbered_list_item", line.replace(/^\d+\.\s/, ""));
    return textBlock("paragraph", line);
  });
}

export async function appendMarkdownToPage(notion: NotionLike, pageId: string, markdown: string): Promise<AppendResult> {
  const children = markdownToBlocks(markdown);
  await notion.blocks.children.append({
    block_id: pageId,
    children: children as any
  });

  const page = await notion.pages.retrieve({ page_id: pageId });
  return {
    pageId,
    url: "url" in page && typeof page.url === "string" ? page.url : null,
    appendedBlocks: children.length
  };
}

export async function updatePageProperties(
  notion: NotionLike,
  pageId: string,
  properties: Record<string, unknown>
): Promise<PageUpdateResult> {
  const page = await notion.pages.update({
    page_id: pageId,
    properties: properties as any
  });

  return {
    pageId,
    url: "url" in page && typeof page.url === "string" ? page.url : null,
    updatedProperties: Object.keys(properties)
  };
}