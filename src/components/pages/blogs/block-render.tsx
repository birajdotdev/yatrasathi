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
      className="prose prose-lg mb-8 max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html() }}
    />
  );
}
