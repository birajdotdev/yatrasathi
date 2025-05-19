"use client";

import { type PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";

interface BlockRenderProps {
  content: PartialBlock[];
}

export default function BlockRender({ content }: BlockRenderProps) {
  const editor = useCreateBlockNote();
  const html = async () => await editor.blocksToHTMLLossy(content);
  return (
    <article
      className="prose prose-lg max-w-none mb-8 dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html() }}
    />
  );
}
