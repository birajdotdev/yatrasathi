"use client";

import { type PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

interface EditorProps {
  initialContent?: string;
  onChange?: () => void;
  editable?: boolean;
}

export default function Editor({
  initialContent,
  onChange,
  editable = true,
}: EditorProps) {
  const { theme } = useTheme();
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  return (
    <div className="-mx-[54px] my-4">
      <BlockNoteView
        editor={editor}
        theme={theme === "dark" ? "dark" : "light"}
        onChange={onChange}
        editable={editable}
        className="editor-content"
      />
    </div>
  );
}
